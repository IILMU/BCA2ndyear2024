"use client"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Dashboard</h1>

      <br />

      <Link href="/dashboard/books">
        Go to Books Section
      </Link>
    </div>
  )
}