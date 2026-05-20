//there will be two path :
//either webpath -> browse ->openurl ->summarize
// direct path -> LLM know s the answer and gives it directly without browsing the web 

//shared shape=candidate

export type Candidate={
    answer: string,
    source? : string[],
    mode: "web" | "direct"
}

//explain what is docker -- llm know the answer and gives it directly without browsing the web -> direct path

//explain what is docker and also give some relevant links to learn more about it -> webpath -> browse ->openurl ->summarize

