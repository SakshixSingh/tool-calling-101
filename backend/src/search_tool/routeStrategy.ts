//this file conatins the logic whether the LLM will go for direct path or web search path

import { RunnableLambda } from "@langchain/core/runnables";
import { searchInputSchema } from "../utils/schemas";

export function routeStrategy(q:string): "web" | "direct"{
      const trimedQuery = q.trim().toLowerCase();

      const isLongQuery= trimedQuery.length > 70;

      const recentYearRegex = /\b20(2[4-9]|3[0-9])\b/.test(trimedQuery);

      const patterns: RegExp[] = [
  /\btop[-\s]*\d+\b/u,
  /\bbest\b/u,
  /\brank(?:ing|ings)?\b/u,
  /\bwhich\s+is\s+better\b/u,
  /\b(?:vs\.?|versus)\b/u,
  /\bcompare|comparison\b/u,

  /\bprice|prices|pricing|cost|costs|cheapest|cheaper|affordable\b/u,
  /\bunder\s*\d+(?:\s*[kK])?\b/u,
  /\p{Sc}\s*\d+/u,

  /\blatest|today|now|current\b/u,
  /\bnews|breaking|trending\b/u,
  /\b(released?|launch|launched|announce|announced|update|updated)\b/u,
  /\bchangelog|release\s*notes?\b/u,

  /\bdeprecated|eol|end\s*of\s*life|sunset\b/u,
  /\broadmap\b/u,

  /\bworks\s+with|compatible\s+with|support(?:ed)?\s+on\b/u,
  /\binstall(ation)?\b/u,

  /\bnear\s+me|nearby\b/u,
];

  const isQueryPresentInPatterns=patterns.some(pattern=>pattern.test(trimedQuery));

  if(isLongQuery || recentYearRegex || isQueryPresentInPatterns){
    return "web"
  }
  
  return "direct"
}

//router step

export const routerStep = RunnableLambda.from(async (input:string)=>{
    const {q} = searchInputSchema.parse(input)

    //decide the path based on the query
    const mode=routeStrategy(q);
    return {
        q,
        mode
    };
})
