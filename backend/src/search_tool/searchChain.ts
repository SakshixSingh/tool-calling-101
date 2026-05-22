import { RunnableBranch, RunnableSequence } from "@langchain/core/runnables";
import { webBasedPath } from "./webPipeline";
import { directBasedPath } from "./directpipeline";
import { routerStep } from "./routeStrategy";
import { finalValidateAndPolish } from "./finalValidate";
import { SearchInput } from "../utils/schemas";
import { Candidate } from "./type";


const branch = RunnableBranch.from<
    { q: string; mode: "web" | "direct" },
    Candidate
>([
    [(input: { q: string; mode: "web" | "direct" }) => input.mode === "web", webBasedPath],
    directBasedPath,
]);

export const searchChain = RunnableSequence.from([
    routerStep,
    branch,
    finalValidateAndPolish,
]);

export async function runSearch(input: SearchInput){
    return await searchChain.invoke(input);
}