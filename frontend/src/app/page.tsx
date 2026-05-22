
"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useRef, useEffect, type FormEvent } from "react"
import { API_URL } from "@/lib/config"

type searchResponse ={
  answer:string,
  source:string[]
}

type currentChatTurn=
|{
   role:"user",
   content: string
}
|{
  role:"assistant",
  content: string,
  sources : string[],
  time: number,
  error?: string
}

export default function Home() {
   
  const [query,setQuery]=useState('')
  const [loading,setLoading]=useState(false);
  const [chat,setChat]=useState<currentChatTurn[]>([]);

  const scrollRef=useRef<HTMLDivElement | null>(null);

  useEffect(()=>{
       scrollRef.current?.scrollTo({top:scrollRef.current?.scrollHeight,behavior:'smooth'});
  },[chat])

  async function runSearch(prompt:string){
    setLoading(true);
    setChat((old)=>[...old,{role:'user',content : prompt}])
    const oldTime= performance.now();
    try{
      const result=await fetch(`${API_URL}/search`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({query:prompt})
        
      })
      const json= await result.json();
      const timeDiff = Math.round(performance.now()-oldTime);
      if (!result.ok) {
        const msg = (json as { error?: string }).error ?? "Request failed."
        setChat((old) => [...old, { role: "assistant", content: "I tried to answer but something went wrong", sources: [], time: timeDiff, error: msg }])
      } else {
        const data = json as searchResponse
        setChat((old) => [...old, { role: "assistant", content: data.answer, sources: data.source, time: timeDiff }])
      }
     
    }catch(error){
      const timeDiff = Math.round(performance.now()-oldTime);
      const msg="Request failed."
      setChat((old)=>[...old,{role:'assistant',content : 'I tried to answer but something went wrong', sources : [], time : timeDiff, error : msg}]);
    }finally{
      setLoading(false);
    }
   
  }
  async function handleChatSubmit(e:FormEvent){
    e.preventDefault();
    const prompt=query.trim();
    if(!prompt || loading) return;
    setQuery('');
    await runSearch(prompt);

  }

  return <div className="flex h-dvh flex-col bg-[#f9fafb] text-gray-900">
    <header className="border-b bg-white px-4 py-3 text-sm flex items-center justify-between">
      <div className="flex flex-col">
        <span className="font-medium text-gray-800">
          Search V1(LCEL Web Agent)
        </span>
        <span className="text-[11px] text-gray-500">
          Answers with sources. Some Queries will browse the web and some don't.
        </span>
      </div>
      </header>
      <main
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto px-4 py-6 space-y-6"
      >
      {
        chat.length===0 &&(
          <div className="mx-auto max-w-2xl text-center text-sm text-gray-500">
             <div className="text-base font-semibold text-gray-800 mb-1"> Ask anything... </div>
             <div className="text-[14px] leading-relaxed">
              Example :
              <br/>
              <code className ="rounded bg-gray-100 px-1 py-2 text-[12px]">
                Top 10 Engineering Colleges in India in 2026.
              </code>
              <br/>
              <code className ="rounded bg-gray-100 px-1 py-2 text-[12px]">
               Explain what is Docker for beginners.
              </code>
             </div>
          </div>
        )
      }
      {
        chat.map((turn, idx)=>{
          //user turn
          if(turn.role==="user"){
            return <div key={idx} className="mx-auto max-w-2xl flex justify-end text-right">
              <div className="inline-block rounded-2xl bg-gray-900 px-4 py-3 text-sm text-white shadow-md max-w-full">
                <div className="whitespace-pre-wrap wrap-break-word"> {turn.content} </div>
              </div>
            </div>
          }
          //assistant turn
          else{
            return <div key={idx} className="mx-auto max-w-2xl flex items-start gap-3 text-left">
              <div className="flex h-8 w-8 flex-none items-center justify-center rounded-md bg-gray-800 text-[11px] text-white semibold">AI</div>
              <div className="flex-1 space-y-3">
                <div className="inline-block rounded-2xl bg-white px-4 py-3 text-sm text-sm text-gray-900 shadow-sm ring-1 ring-gray-200 whitespace-pre-wrap wrap-break-word">
                  {turn.content}
                </div>
                <div className="text-[11px] text-gray-500 flex flex-wrap items-center gap-x-2">
                  {
                    typeof turn.time === 'number' && (
                      <span className="text-[11px] text-gray-500">
                        {turn.time}ms took to answer.
                      </span>
                    )
                  }
                  {
                    turn?.error && <span>
                      {turn.error}
                    </span>
                  }
                </div>
                {
                  turn?.sources?.length > 0 && (
                    <div className="rounded-lg bg-white px-3 py-2 text-[12px] shadow-sm ring-1 ring-gray-200">
                      <div className="text-[11px] font-medium text-gray-600 mb-1">Sources</div>
                      <ul className="space-y-1">
                        {
                          turn.sources.map((source, idx)=>(
                            <li key={idx} className="truncate">
                              <a href={source} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline underline-offset-4 break-all">
                                {source}
                              </a>
                            </li>
                          ))
                        }
                     </ul>
                    </div>
                  )
                }
              </div>
            </div>
          }
        })
      }

      {
        loading && (
          
            <div className="mx-auto max-w-2xl flex items-start gap-3 text-left">
              <div className="flex h-8 w-8 flex-none items-center justify-center rounded-md bg-gray-700 text-[11px] font-semibold">...</div>
              <p className="text-gray-500 text-[11px]">
                Thinking...
              </p>
            </div>
          
        )
      }
      </main>
      <footer className="shrink-0 border-t bg-white px-4 py-4">
        <form onSubmit={handleChatSubmit} className="mx-auto flex w-full max-w-2xl items-end gap-2">
          <Input
            className="w-full text-foreground"
            placeholder="Ask me query..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
          <Button
            className="shrink-0"
            type="submit"
            disabled={loading || query.trim().length < 5}
          >
            {loading ? "..." : "Send"}
          </Button>
        </form>
      </footer>
  </div>
}
