'use client'
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { TrendingUp } from "lucide-react"
import { Button, Card, Input, Label } from "@/components/ui_wealth"
import api from "@/lib/api"
import { useUserStore } from "@/store"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [pw, setPw] = useState("")
    const [err, setErr] = useState("")

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!email || !pw) {
            setErr("Email and password required")
            return
        }
        try {
            const res = await api.post("/identity/auth/login", { email, password: pw })
            localStorage.setItem("wealthos_token", res.data.token)
            useUserStore.getState().setUser({
                id: res.data.user.id,
                name: res.data.user.name,
                email: res.data.user.email,
                income: res.data.user.monthlyIncome || res.data.user.monthly_income || 0
            })
            router.push("/dashboard")
        } catch (error: any) {
            setErr(error.response?.data?.error || "Invalid email or password")
        }
    }

    return (
        <div className="min-h-screen grid place-items-center relative px-4">
            <div className="absolute inset-0 -z-10 grid-bg opacity-30" />
            <div className="w-full max-w-md">
                <Link href="/" className="flex items-center justify-center gap-2 mb-6">
                    <div className="size-9 rounded-xl bg-gradient-to-br from-primary to-accent2 grid place-items-center text-white">
                        <TrendingUp className="size-4" />
                    </div>
                    <span className="font-display font-bold text-xl">WealthOS</span>
                </Link>
                <Card glass>
                    <h1 className="text-2xl font-display font-bold mb-1">Welcome back</h1>
                    <p className="text-sm text-muted-foreground mb-6">Sign in to your portfolio.</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></div>
                        <div><Label>Password</Label><Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" /></div>
                        {err && <p className="text-xs text-destructive">{err}</p>}
                        <div className="text-right"><Link href="/login" className="text-xs text-primary hover:underline">Forgot password?</Link></div>
                        <Button type="submit" className="w-full">Sign in</Button>
                    </form>
                    <p className="text-xs text-center text-muted-foreground mt-5">No account? <Link href="/signup" className="text-primary hover:underline">Create one</Link></p>
                </Card>
                <p className="text-xs text-center text-muted-foreground mt-5">Join 10,000+ Indian investors</p>
            </div>
        </div>
    )
}