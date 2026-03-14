import { config } from "dotenv";

config({ path: ".env.local" });

import { faker } from "@faker-js/faker";
import { drizzle } from "drizzle-orm/node-postgres";
import { analysisItems, roasts } from "./schema";

const db = drizzle(process.env.DATABASE_URL ?? "", { casing: "snake_case" });

// ─── Code snippets por linguagem ────────────────────────────────────────────

const codeSnippets: Record<string, string[]> = {
  javascript: [
    `var data = []
for (var i = 0; i < 100; i++) {
  data.push(i)
}
var result = data.filter(function(x) { return x % 2 == 0 })
console.log(result)`,

    `function getUserById(id) {
  var user = null
  for (var i = 0; i < users.length; i++) {
    if (users[i].id == id) {
      user = users[i]
    }
  }
  return user
}`,

    `async function fetchData() {
  try {
    var res = await fetch('https://api.example.com/data')
    var json = res.json()
    return json
  } catch(e) {
    console.log(e)
  }
}`,

    `function sumArray(arr) {
  var sum = 0
  arr.forEach(function(item) {
    sum += item
  })
  return sum
}

var numbers = [1,2,3,4,5,6,7,8,9,10]
console.log(sumArray(numbers))`,

    `const processUsers = (users) => {
  let result = []
  for (let i = 0; i < users.length; i++) {
    if (users[i].active == true) {
      result.push({
        id: users[i].id,
        name: users[i].name,
        email: users[i].email
      })
    }
  }
  return result
}`,

    `function validateEmail(email) {
  if (email.includes('@')) {
    return true
  }
  return false
}

function validatePassword(password) {
  if (password.length > 6) {
    return true
  }
  return false
}`,

    `const users = require('./users.json')

function findUser(email, password) {
  for (var i = 0; i < users.length; i++) {
    if (users[i].email === email && users[i].password === password) {
      return users[i]
    }
  }
  return null
}`,
  ],

  typescript: [
    `interface User {
  id: number
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  isAdmin: boolean
  isActive: boolean
  isVerified: boolean
}

function getUser(id: number): User | undefined {
  return users.find(u => u.id == id)
}`,

    `type ApiResponse = {
  data: any
  error: any
  status: number
}

async function callApi(url: string): Promise<ApiResponse> {
  const res = await fetch(url)
  const data = await res.json()
  return { data, error: null, status: res.status }
}`,

    `class UserService {
  private users: any[] = []

  constructor() {
    this.users = []
  }

  getAll(): any[] {
    return this.users
  }

  getById(id: any): any {
    return this.users.find(u => u.id == id)
  }

  save(user: any): void {
    this.users.push(user)
  }

  delete(id: any): void {
    this.users = this.users.filter(u => u.id != id)
  }
}`,

    `import { useState, useEffect } from 'react'

export default function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err)
        setLoading(false)
      })
  }, [])

  return <div>{users.map((u: any) => <div key={u.id}>{u.name}</div>)}</div>
}`,

    `function mergeObjects<T extends object>(obj1: T, obj2: Partial<T>): T {
  const result: any = {}
  for (const key in obj1) {
    result[key] = obj1[key]
  }
  for (const key in obj2) {
    result[key] = obj2[key]
  }
  return result as T
}`,

    `const cache: Record<string, any> = {}

async function fetchWithCache(url: string) {
  if (cache[url]) {
    return cache[url]
  }
  const res = await fetch(url)
  const data = await res.json()
  cache[url] = data
  return data
}`,
  ],

  python: [
    `def get_users(db):
    users = []
    result = db.execute("SELECT * FROM users")
    for row in result:
        users.append(row)
    return users

def find_user(db, id):
    result = db.execute(f"SELECT * FROM users WHERE id = {id}")
    return result.fetchone()`,

    `import json
import requests

def fetch_data(url):
    try:
        response = requests.get(url)
        data = json.loads(response.text)
        return data
    except:
        return None`,

    `class Calculator:
    def __init__(self):
        self.result = 0

    def add(self, a, b):
        self.result = a + b
        return self.result

    def subtract(self, a, b):
        self.result = a - b
        return self.result

    def multiply(self, a, b):
        self.result = a * b
        return self.result

    def divide(self, a, b):
        self.result = a / b
        return self.result`,

    `def is_prime(n):
    if n < 2:
        return False
    for i in range(2, n):
        if n % i == 0:
            return False
    return True

primes = []
for i in range(1, 1000):
    if is_prime(i):
        primes.append(i)
print(primes)`,

    `def process_data(data):
    result = []
    for item in data:
        if item['active'] == True:
            new_item = {}
            new_item['id'] = item['id']
            new_item['name'] = item['name']
            new_item['value'] = item['value'] * 2
            result.append(new_item)
    return result`,

    `import os
import sys

def read_config():
    config = {}
    config['db_host'] = os.environ.get('DB_HOST', 'localhost')
    config['db_port'] = os.environ.get('DB_PORT', '5432')
    config['db_name'] = os.environ.get('DB_NAME', 'mydb')
    config['db_user'] = os.environ.get('DB_USER', 'admin')
    config['db_password'] = os.environ.get('DB_PASSWORD', '123456')
    return config`,
  ],

  go: [
    `package main

import (
  "fmt"
  "net/http"
  "io/ioutil"
)

func fetchData(url string) string {
  resp, _ := http.Get(url)
  defer resp.Body.Close()
  body, _ := ioutil.ReadAll(resp.Body)
  return string(body)
}

func main() {
  data := fetchData("https://api.example.com")
  fmt.Println(data)
}`,

    `package main

import "fmt"

func sumSlice(nums []int) int {
  sum := 0
  for i := 0; i < len(nums); i++ {
    sum = sum + nums[i]
  }
  return sum
}

func main() {
  nums := []int{1, 2, 3, 4, 5}
  fmt.Println(sumSlice(nums))
}`,

    `package handlers

import (
  "encoding/json"
  "net/http"
)

func GetUsers(w http.ResponseWriter, r *http.Request) {
  users := []map[string]interface{}{
    {"id": 1, "name": "Alice"},
    {"id": 2, "name": "Bob"},
  }
  data, _ := json.Marshal(users)
  w.Write(data)
}`,
  ],

  rust: [
    `fn find_max(numbers: &Vec<i32>) -> i32 {
    let mut max = numbers[0];
    for i in 0..numbers.len() {
        if numbers[i] > max {
            max = numbers[i];
        }
    }
    max
}

fn main() {
    let nums = vec![3, 1, 4, 1, 5, 9, 2, 6];
    println!("{}", find_max(&nums));
}`,

    `use std::collections::HashMap;

fn word_count(text: &str) -> HashMap<String, usize> {
    let mut map = HashMap::new();
    for word in text.split_whitespace() {
        let count = map.entry(word.to_string()).or_insert(0);
        *count += 1;
    }
    map
}`,
  ],

  sql: [
    `SELECT u.*, o.*, p.*
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN products p ON o.product_id = p.id
WHERE u.active = 1
AND o.status = 'pending'
AND p.stock > 0
ORDER BY o.created_at DESC`,

    `UPDATE users SET
  last_login = NOW(),
  login_count = login_count + 1,
  updated_at = NOW()
WHERE id IN (
  SELECT user_id FROM sessions WHERE created_at > NOW() - INTERVAL '1 day'
)`,

    `SELECT
  u.id,
  u.name,
  COUNT(o.id) as order_count,
  SUM(o.total) as total_spent,
  AVG(o.total) as avg_order
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 5
ORDER BY total_spent DESC
LIMIT 100`,
  ],

  css: [
    `.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.container .header {
  background-color: #ffffff;
  padding: 20px 15px;
}

.container .header .nav {
  display: flex;
}

.container .header .nav .nav-item {
  margin-right: 15px;
}

.container .header .nav .nav-item a {
  color: #333333;
  text-decoration: none;
}`,

    `* {
  margin: 0 !important;
  padding: 0 !important;
  box-sizing: border-box !important;
}

body {
  font-family: Arial !important;
  font-size: 16px !important;
  color: #333 !important;
  background: white !important;
}`,
  ],

  java: [
    `public class UserService {
    private List<User> users = new ArrayList<>();

    public User getUserById(int id) {
        User result = null;
        for (int i = 0; i < users.size(); i++) {
            if (users.get(i).getId() == id) {
                result = users.get(i);
            }
        }
        return result;
    }

    public void saveUser(User user) {
        users.add(user);
    }

    public List<User> getAllUsers() {
        return users;
    }
}`,

    `import java.sql.*;

public class DatabaseHelper {
    public ResultSet query(String sql) throws Exception {
        Connection conn = DriverManager.getConnection(
            "jdbc:mysql://localhost/mydb", "root", "password"
        );
        Statement stmt = conn.createStatement();
        return stmt.executeQuery(sql);
    }
}`,
  ],
};

// ─── Listas de quotes e fixes realistas ─────────────────────────────────────

const roastQuotes = [
  "This code looks like it was written at 3am during a hackathon and never touched again.",
  "I've seen better code written by a cat walking on a keyboard.",
  "Whoever wrote this clearly skipped every CS class after 'Hello World'.",
  "This is less code and more a cry for help.",
  "I'd roast this code but my oven isn't broken enough.",
  "This function is doing so much it should file for unemployment.",
  "Error handling? Never heard of her.",
  "The only thing missing is a 'Here Be Dragons' comment at the top.",
  "This code has more red flags than a bull's eye view.",
  "SQL injection is basically a feature at this point.",
  "I admire the confidence it takes to deploy this.",
  "This is technically code in the same way that a dumpster fire is technically a heat source.",
  "The variable names alone could cause PTSD in senior developers.",
  "This code doesn't just have bugs — it has an ecosystem.",
  "With great power comes great responsibility. This code has neither.",
  "Nesting level so deep it needs its own zip code.",
  "This is the coding equivalent of solving a math problem by trial and error with a calculator.",
  "Every `any` type is a tiny developer giving up on life.",
  "Global variables everywhere — congratulations, you've reinvented jQuery.",
  "This would fail a code review from someone who just googled 'what is programming'.",
  "Not even Stack Overflow would help you with this one.",
  "The technical debt here has accrued interest.",
  "This code could power a time machine — straight back to 2005.",
  "The spaghetti is so tangled even the Italian would apologize.",
  "This function has more responsibilities than a Swiss Army knife.",
];

const gentleQuotes = [
  "Solid foundation here — a few tweaks away from something great.",
  "Good structure overall, just needs some polish in a few spots.",
  "This is clean and readable — nice work keeping it simple.",
  "Well organized and easy to follow. Minor improvements could push this to excellent.",
  "The logic is sound and the intent is clear.",
  "Good use of patterns here. A few edge cases left to handle.",
  "Clean code that shows thoughtful organization.",
];

const suggestedFixes = [
  "Replace all `var` with `const`/`let` and enable strict mode.",
  "Extract repeated logic into utility functions and add unit tests.",
  "Use parameterized queries to prevent SQL injection vulnerabilities.",
  "Add proper error handling with typed error classes instead of swallowing exceptions.",
  "Replace manual loops with array methods like `.map()`, `.filter()`, `.reduce()`.",
  "Add TypeScript strict mode and eliminate all `any` types.",
  "Break this monolithic function into smaller, single-responsibility functions.",
  "Add input validation at the boundaries of your system.",
  "Replace the manual cache implementation with a proper caching library.",
  "Add proper logging instead of `console.log` statements.",
  "Use a connection pool instead of opening a new DB connection per request.",
  "Add pagination to avoid loading unbounded data into memory.",
  "Implement proper authentication — comparing plain text passwords is a security disaster.",
  "Use environment variables for configuration — hardcoded credentials need to go.",
  "Add proper TypeScript return types to all functions.",
  "Replace the `O(n²)` loop with a hash map lookup for `O(n)` complexity.",
  "Use async/await consistently — mixing promises and callbacks is asking for trouble.",
  "Add meaningful variable names — `x`, `temp`, `data` don't tell you anything.",
  "Consolidate duplicated code into a shared utility or helper.",
  "Use a schema validation library like Zod to validate inputs properly.",
];

// ─── Analysis templates por severidade ──────────────────────────────────────

const criticalItems = [
  {
    title: "SQL Injection Vulnerability",
    description:
      "String interpolation is used directly in SQL queries, allowing attackers to inject arbitrary SQL code. Use parameterized queries or a query builder.",
  },
  {
    title: "Plaintext Password Storage",
    description:
      "Passwords are being stored or compared in plaintext. Always hash passwords with a strong algorithm like bcrypt or argon2.",
  },
  {
    title: "Unhandled Promise Rejections",
    description:
      "Async operations lack proper error handling. Unhandled rejections can crash the process or silently fail in production.",
  },
  {
    title: "Memory Leak Risk",
    description:
      "Event listeners or timers are registered without cleanup, causing memory to grow unbounded over time.",
  },
  {
    title: "Hardcoded Credentials",
    description:
      "Database credentials or API keys are hardcoded in source code. Move secrets to environment variables and a secrets manager.",
  },
  {
    title: "Missing Authentication Check",
    description:
      "Sensitive operations are performed without verifying the caller's identity or permissions.",
  },
  {
    title: "Unbounded Data Loading",
    description:
      "Fetching all rows without a LIMIT clause can load millions of records into memory, causing OOM crashes.",
  },
  {
    title: "Race Condition",
    description:
      "Shared mutable state is accessed concurrently without synchronization, leading to unpredictable behavior.",
  },
];

const warningItems = [
  {
    title: "Excessive Use of `any` Type",
    description:
      "Widespread `any` usage defeats the purpose of TypeScript. Define proper interfaces and types for all values.",
  },
  {
    title: "Deeply Nested Logic",
    description:
      "Multiple levels of nesting make this code hard to read and test. Consider early returns or extracting sub-functions.",
  },
  {
    title: "Missing Error Boundaries",
    description:
      "Errors are caught but not handled meaningfully. Add proper recovery logic or re-throw with context.",
  },
  {
    title: "Inefficient Algorithm",
    description:
      "The current O(n²) approach works for small datasets but will degrade significantly at scale. Consider using a hash map.",
  },
  {
    title: "No Input Validation",
    description:
      "Function arguments are used without validation. Unexpected types or values will produce confusing runtime errors.",
  },
  {
    title: "Magic Numbers",
    description:
      "Literal numbers are scattered throughout the code without explanation. Extract them into named constants.",
  },
  {
    title: "Function Too Long",
    description:
      "This function is doing too many things. Break it into smaller, focused functions with single responsibilities.",
  },
  {
    title: "Mutating Function Arguments",
    description:
      "Input arguments are modified in place, causing unexpected side effects for callers.",
  },
  {
    title: "Missing Return Type Annotation",
    description:
      "Explicit return types improve readability and catch bugs early. Add return type annotations to all exported functions.",
  },
  {
    title: "Inconsistent Error Handling",
    description:
      "Some paths handle errors while others silently fail. Pick a consistent error strategy across the module.",
  },
  {
    title: "Dead Code",
    description:
      "There are unreachable code paths and unused variables. Remove them to reduce confusion and maintenance burden.",
  },
];

const goodItems = [
  {
    title: "Clear Naming Conventions",
    description:
      "Variable and function names are descriptive and follow a consistent convention. This greatly improves readability.",
  },
  {
    title: "Good Separation of Concerns",
    description:
      "Business logic is properly separated from data access. This makes the code easier to test and maintain.",
  },
  {
    title: "Proper Use of Constants",
    description:
      "Magic values are extracted into well-named constants. This makes the code self-documenting and easier to update.",
  },
  {
    title: "Consistent Code Style",
    description:
      "Formatting is uniform throughout the file. Consistent style reduces cognitive load when reading the code.",
  },
  {
    title: "Early Returns Pattern",
    description:
      "Early returns are used to handle edge cases first, keeping the main logic clean and reducing nesting.",
  },
  {
    title: "Immutable Data Patterns",
    description:
      "Data transformations produce new objects rather than mutating existing ones, avoiding unintended side effects.",
  },
  {
    title: "Proper Error Propagation",
    description:
      "Errors are caught and re-thrown with additional context, making debugging much easier.",
  },
  {
    title: "Typed Interfaces",
    description:
      "Strong TypeScript interfaces are used throughout, making the code self-documenting and safer to refactor.",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

type Verdict =
  | "needs_serious_help"
  | "rough_around_edges"
  | "decent_code"
  | "solid_work"
  | "exceptional";

type Severity = "critical" | "warning" | "good";

function scoreToVerdict(score: number): Verdict {
  if (score < 25) return "needs_serious_help";
  if (score < 45) return "rough_around_edges";
  if (score < 65) return "decent_code";
  if (score < 82) return "solid_work";
  return "exceptional";
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickRandomN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, shuffled.length));
}

function generateAnalysisItems(
  roastId: string,
  score: number,
): Array<{
  roastId: string;
  severity: Severity;
  title: string;
  description: string;
  order: number;
}> {
  const items: Array<{
    roastId: string;
    severity: Severity;
    title: string;
    description: string;
    order: number;
  }> = [];

  let criticalCount: number;
  let warningCount: number;
  let goodCount: number;

  if (score < 25) {
    criticalCount = faker.number.int({ min: 2, max: 4 });
    warningCount = faker.number.int({ min: 1, max: 2 });
    goodCount = 0;
  } else if (score < 45) {
    criticalCount = faker.number.int({ min: 1, max: 2 });
    warningCount = faker.number.int({ min: 2, max: 3 });
    goodCount = faker.number.int({ min: 0, max: 1 });
  } else if (score < 65) {
    criticalCount = faker.number.int({ min: 0, max: 1 });
    warningCount = faker.number.int({ min: 2, max: 3 });
    goodCount = faker.number.int({ min: 1, max: 2 });
  } else if (score < 82) {
    criticalCount = 0;
    warningCount = faker.number.int({ min: 1, max: 2 });
    goodCount = faker.number.int({ min: 2, max: 3 });
  } else {
    criticalCount = 0;
    warningCount = faker.number.int({ min: 0, max: 1 });
    goodCount = faker.number.int({ min: 3, max: 4 });
  }

  const selectedCritical = pickRandomN(criticalItems, criticalCount);
  const selectedWarnings = pickRandomN(warningItems, warningCount);
  const selectedGood = pickRandomN(goodItems, goodCount);

  let order = 1;

  for (const item of selectedCritical) {
    items.push({ roastId, severity: "critical", ...item, order: order++ });
  }
  for (const item of selectedWarnings) {
    items.push({ roastId, severity: "warning", ...item, order: order++ });
  }
  for (const item of selectedGood) {
    items.push({ roastId, severity: "good", ...item, order: order++ });
  }

  return items;
}

// ─── Seed ────────────────────────────────────────────────────────────────────

async function seed() {
  console.log("🌱 Starting seed...");

  const languages = Object.keys(codeSnippets);
  const roastData: Array<{
    code: string;
    language: string;
    lineCount: number;
    roastMode: boolean;
    score: number;
    verdict: Verdict;
    roastQuote: string | null;
    suggestedFix: string | null;
    createdAt: Date;
  }> = [];

  for (let i = 0; i < 100; i++) {
    const language = pickRandom(languages);
    const code = pickRandom(codeSnippets[language]);
    const lineCount = code.split("\n").length;
    const roastMode = faker.datatype.boolean({ probability: 0.4 });
    const score = Math.round(
      faker.number.float({ min: 5, max: 98, fractionDigits: 1 }),
    );
    const verdict = scoreToVerdict(score);
    const isGoodCode = score >= 65;

    roastData.push({
      code,
      language,
      lineCount,
      roastMode,
      score,
      verdict,
      roastQuote:
        roastMode || !isGoodCode
          ? pickRandom(score < 65 ? roastQuotes : gentleQuotes)
          : pickRandom(gentleQuotes),
      suggestedFix: score < 82 ? pickRandom(suggestedFixes) : null,
      createdAt: faker.date.between({
        from: "2024-01-01",
        to: new Date().toISOString(),
      }),
    });
  }

  console.log(`📦 Inserting 100 roasts...`);
  const inserted = await db.insert(roasts).values(roastData).returning({
    id: roasts.id,
    score: roasts.score,
  });

  const allAnalysisItems = inserted.flatMap(({ id, score }) =>
    generateAnalysisItems(id, score),
  );

  console.log(`📦 Inserting ${allAnalysisItems.length} analysis items...`);

  // Inserir em lotes de 50 para não sobrecarregar
  const batchSize = 50;
  for (let i = 0; i < allAnalysisItems.length; i += batchSize) {
    const batch = allAnalysisItems.slice(i, i + batchSize);
    await db.insert(analysisItems).values(batch);
  }

  console.log("✅ Seed completed!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
