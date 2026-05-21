//simply calling a model 
//no tavily or web search involved

import { RunnableLambda } from "@langchain/core/runnables";
import { Candidate } from "./type";
import { getModel } from "../shared/models";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";



export const directBasedPath=RunnableLambda.from(
    async (input:{q:string,mode:"web" | "direct"}) : Promise<Candidate>=>{
        const model=getModel({temperature:0.2});

         const res=await model.invoke(
            [
                new SystemMessage(
                    [
                        "You concisely answer the question using provided page summaries",
                        "Rules :",
                        "Be accurate and neutral",
                        "5-8 sentences max",
                        "Use only provided summaried . Dont invent new facts"
                    ].join('\n')
                ),
                new HumanMessage(
                    input.q
                )
            ]
        )

        const finalAns = (
            typeof res === "string" ? res : String(res.content ?? "")
        ).trim();

        return {
            answer :finalAns,
            source :[],
            mode: 'direct'
        }
    }

)

