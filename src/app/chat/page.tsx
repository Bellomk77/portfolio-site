'use client'
import { useState, useRef, useEffect } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import { Send, Brain, User, Copy, ThumbsUp, RefreshCw, Sparkles, BookOpen, AlertCircle } from 'lucide-react'
import { QUICK_TAX_QUESTIONS } from '@/lib/nigerian-tax-data'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  loading?: boolean
}

function MessageBubble({ msg }: { msg: Message }) {
  const [copied, setCopied] = useState(false)

  function copyText() {
    navigator.clipboard.writeText(msg.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (msg.role === 'user') {
    return (
      <div className="flex gap-3 justify-end">
        <div className="max-w-[75%] bg-ng-600/20 border border-ng-800/60 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-gray-100 leading-relaxed whitespace-pre-wrap">
          {msg.content}
        </div>
        <div className="w-8 h-8 rounded-full bg-ng-600/30 border border-ng-800 flex items-center justify-center flex-shrink-0 mt-0.5">
          <User className="w-4 h-4 text-ng-400" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-800/60 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Brain className="w-4 h-4 text-purple-400" />
      </div>
      <div className="max-w-[80%] group">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl rounded-tl-sm px-5 py-4 text-sm text-gray-200 leading-relaxed">
          {msg.loading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              <span>TaxPadi AI is thinking...</span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }} />
          )}
        </div>
        {!msg.loading && (
          <div className="flex items-center gap-2 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={copyText} className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-400 transition-colors px-2 py-1 rounded hover:bg-gray-800">
              {copied ? <><ThumbsUp className="w-3 h-3 text-ng-400" />Copied!</> : <><Copy className="w-3 h-3" />Copy</>}
            </button>
            <span className="text-gray-700 text-xs">{msg.timestamp.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function formatMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-800 text-ng-300 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
    .replace(/^### (.*)/gm, '<div class="text-white font-semibold text-base mt-3 mb-1">$1</div>')
    .replace(/^## (.*)/gm,  '<div class="text-white font-bold text-lg mt-4 mb-2">$1</div>')
    .replace(/^- (.*)/gm,   '<div class="flex items-start gap-2 my-0.5"><span class="text-ng-500 mt-1.5 text-xs">●</span><span>$1</span></div>')
    .replace(/\n\n/g, '<br/><br/>')
}

const INITIAL_MESSAGE: Message = {
  id: '0',
  role: 'assistant',
  content: `Ẹ káabọ̀! Welcome to TaxPadi AI — your Nigerian tax advisor. 🇳🇬

I'm trained on all Nigerian tax legislation including the **Companies Income Tax Act (CITA)**, **Personal Income Tax Act (PITA)**, **Value Added Tax Act (VATA)**, and all **Finance Acts up to 2024**.

I can help you with:
- **CIT, VAT, PAYE, WHT, CGT** — calculations, rates, and filing
- **Finance Act 2024** — windfall tax, e-invoicing, new provisions
- **FIRS deadlines** — when to file and what happens if you're late
- **Tax optimisation** — legal ways to reduce your tax bill
- **Audit defence** — what to do if FIRS comes knocking

**Try asking me something** or click one of the quick questions below. I'll cite the specific laws so you can verify everything yourself.

*Note: For complex transactions, court appearances, or FIRS negotiations, always engage a CITN-qualified tax consultant.*`,
  timestamp: new Date(),
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const bottomRef               = useRef<HTMLDivElement>(null)
  const textareaRef             = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text?: string) {
    const userText = (text || input).trim()
    if (!userText || loading) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: userText, timestamp: new Date() }
    const aiMsg: Message   = { id: (Date.now() + 1).toString(), role: 'assistant', content: '', timestamp: new Date(), loading: true }

    setMessages(prev => [...prev, userMsg, aiMsg])
    setInput('')
    setLoading(true)

    try {
      const history = messages.filter(m => !m.loading).map(m => ({ role: m.role, content: m.content }))
      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: userText, history }),
      })

      if (!res.ok) throw new Error('API error')

      const reader     = res.body?.getReader()
      const decoder    = new TextDecoder()
      let accumulated  = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          accumulated += decoder.decode(value, { stream: true })
          setMessages(prev => prev.map(m => m.id === aiMsg.id ? { ...m, content: accumulated, loading: false } : m))
        }
      }
    } catch {
      setMessages(prev => prev.map(m =>
        m.id === aiMsg.id
          ? { ...m, content: 'Sorry, I encountered an error. Please check that your ANTHROPIC_API_KEY is set in .env.local and try again.', loading: false }
          : m
      ))
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function clearChat() {
    setMessages([INITIAL_MESSAGE])
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />

      <main className="flex-1 ml-64 flex flex-col h-screen">
        {/* Header */}
        <header className="flex-shrink-0 bg-gray-950/90 backdrop-blur border-b border-gray-800 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-600/20 border border-purple-800/50 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                TaxPadi AI Advisor
                <span className="text-xs bg-ng-950/60 text-ng-400 border border-ng-800/50 px-2 py-0.5 rounded-full">Finance Act 2024</span>
              </h1>
              <p className="text-gray-500 text-xs">Trained on CITA, PITA, VATA, Finance Acts, FIRS Circulars</p>
            </div>
          </div>
          <button onClick={clearChat} className="flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm px-3 py-2 rounded-lg hover:bg-gray-800 transition-all">
            <RefreshCw className="w-4 h-4" />
            Clear Chat
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
          {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
          <div ref={bottomRef} />
        </div>

        {/* Quick questions */}
        {messages.length <= 2 && (
          <div className="px-8 pb-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-gray-500 text-xs font-medium">Quick Questions</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_TAX_QUESTIONS.slice(0, 6).map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs bg-gray-900 border border-gray-800 text-gray-300 hover:text-white hover:border-gray-600 px-3 py-2 rounded-xl transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex-shrink-0 border-t border-gray-800 px-8 py-4">
          <div className="flex gap-3 items-end bg-gray-900 border border-gray-800 rounded-2xl p-3 focus-within:border-ng-700 transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Ask anything about Nigerian tax law — CIT, VAT, PAYE, WHT, FIRS deadlines..."
              className="flex-1 bg-transparent text-white text-sm resize-none focus:outline-none placeholder:text-gray-600 max-h-32 leading-relaxed"
              style={{ scrollbarWidth: 'none' }}
              disabled={loading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all',
                input.trim() && !loading
                  ? 'bg-ng-600 hover:bg-ng-500 text-white shadow-lg shadow-ng-600/30'
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed'
              )}
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center gap-4 mt-2 px-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <BookOpen className="w-3 h-3" />
              Cites legal sources
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <AlertCircle className="w-3 h-3" />
              Not a substitute for a CITN advisor on complex matters
            </div>
            <span className="text-xs text-gray-700">Enter to send • Shift+Enter for new line</span>
          </div>
        </div>
      </main>
    </div>
  )
}
