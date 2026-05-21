
//user -> top 10 engineering colleges in india 
//search the web
//visit and each and every page 
//summarize the content 
//return the candidate with source and mode 

import { RunnableLambda, RunnableSequence } from "@langchain/core/runnables";
import { webSearch } from "../utils/webSearch";
import { openurl } from "../utils/openUrl";
import { summarize } from "../utils/summarize";
import { getModel } from "../shared/models";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Candidate } from "./type";

const setTopResults=5;

export const websearchResult=RunnableLambda.from(
    async (input: {q:string, mode:"web" | "direct"})=>{
       const result=await webSearch(input.q);

       return {
        ...input,
        result,
       }
    }
)

export const openandsummarizestep=RunnableLambda.from(
    async (input:{q:string,mode:"web" | "direct",result:any[]})=>{
        if(!Array.isArray(input.result)|| input.result.length===0){
            return {
                ...input,
                pageSummaries:[],
                fallback: 'no result' as const
            }
        }

        const extractResults=input.result.slice(0,setTopResults);

        const settledResults=await Promise.allSettled(
            extractResults.map(async (r : any)=>{
              
                const opened= await openurl(r.url);
                const summarizeContent= await summarize(opened.content);

                return {
                    url: r.url,
                    summary : summarizeContent.summary

                };
            }
        ))
;
        const settledPageSummaries=settledResults.filter(
            settledResults=>settledResults.status==="fulfilled"
        ).map(s=>s.value);

    if(settledPageSummaries.length === 0){
    const fallbackSnippetSummaries = extractResults.map((result: any) => ({
        url: result.url,
        summary: String(result.snippet || result.title || "").trim()
    })).filter((x:any) => x.summary.length > 0)

    return {
        ...input,
        pageSummaries: fallbackSnippetSummaries,
        fallback: 'snippets' as const
    }
      }

      return {
        ...input,
        pageSummaries : settledPageSummaries,
        fallback : 'none' as const
      }
    }
)


//compose step 

//candidate -> answer + source + mode

export const composeStep=RunnableLambda.from(
    async(input:{
        q:string,
        pageSummaries: Array<{url:string,summary:string}>
        mode: "web" | "direct"
        fallback : 'no result' | 'snippets' | 'none'
    }):Promise<Candidate>=>{
        const model= getModel({temperature:0.2});

        if(!input.pageSummaries || input.pageSummaries.length === 0){
            const directResponseFromModel= await model.invoke([
                new SystemMessage([
                    "You answer briefly and acccurately for begginers",
                    "If unsure say so ",
             ].join('\n') 
            ),
            new HumanMessage(input.q)
        ])

        const directAns = (
            typeof directResponseFromModel === "string"
                ? directResponseFromModel
                : String(directResponseFromModel.content ?? "")
        ).trim();

        return {
            answer : directAns,
            source : [],
            mode: 'direct'
        }
        }

        const res=await model.invoke(
            [
                new SystemMessage(
                    [
                        "You concisely answer the question using provided page summaries",
                        "Rules :",
                        "Be accurate and neutral",
                        "5-8 sentences max",
                        "Use only provided summaries. Dont invent new facts"
                    ].join('\n')
                ),
                new HumanMessage(
                    [
                        `Question : ${input.q}`,
                        "Summaries:",
                        JSON.stringify(input.pageSummaries,null,2)
                    ].join("\n")
                )
            ]
        )

        const finalAns = (
            typeof res === "string" ? res : String(res.content ?? "")
        ).trim();

        return {
            answer : finalAns,
            source : input.pageSummaries.map(s=>s.url),
            mode: 'web'
        }
    }
)


//LCEL:
//WEBSEARCH -> OPEN AND SUMMARIZE -> COMPOSE

export const webBasedPath= RunnableSequence.from(
    [websearchResult,openandsummarizestep,composeStep]
)

