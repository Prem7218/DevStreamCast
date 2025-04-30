import { syntaxTree } from "@codemirror/language";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getDatabase, ref, get, update, child } from "firebase/database";

const GEMINI_API_KEY = process.env.THE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
export const imogies = ["👍", "❤️", "🔥", "😂"];
export const reaction1 = [
  "😊",
  "❤️",
  "👍",
  "😄",
  "💡",
  "🎉",
  "❤️",
  "😄",
  "😊",
  "💡",
  "💡",
];
export const PROMPT1 = `Generate Strictly Only `; // Number of questions
export const PROMPT2 = ` multiple-choice questions and answers Of `; // Level
export const PROMPT2a = `for tech quiz on`; // Language
export const PROMPT3 = ` && The Challenge / QuestionType is:  `; // Challenge Type
export const PROMPT4 = ` as there are different Challenge / QuestionType options like: MCQ, Code Completion, Error Finding, Optimize Code Selection, Mix, Debugging, Algorithm Analysis, etc.`;

// Adding randomness to break deterministic responses
export const PROMPT_RANDOMIZER = `Ensure these questions are **unique**, different from previously generated ones, and cover **varied topics**.  
- Avoid repeating questions from **past responses**.  
- Use **diverse phrasings**, alternate wording, and different difficulty levels.  
- Incorporate **real-world scenarios** where applicable.  
- Introduce randomness by shuffling question order.  
- **Variation Factor**: ${Date.now()}-${Math.floor(Math.random() * 10000)}  
`;

export const PROMPT5 = ` Provide the response **strictly** in the following JSON format **without extra text, explanations, or markdown formatting**:  
[
  {
    "question": "What does JavaScript primarily control in a web browser?",
    "answers": [
      "The appearance of web pages (styling)",
      "The structure of web pages (HTML)",
      "The behavior and interactivity of web pages",
      "The storage of web page data"
    ],
    "correctAnswer": "The behavior and interactivity of web pages"
  }
]`;

export const SubmitPROMPT1 = `📢 You are an experienced software engineer and code reviewer. Your task is to review the following `;
export const SubmitPROMPT2 = ` code based on best practices, efficiency, correctness, and readability. ### 📌 Problem Statement: `;
export const SubmitPROMPT3 = `### 🔍 **Review Guidelines**:
Provide a structured review that includes:

1️⃣ **Optimized Code Using Data Structures** 🚀  
   - Rewrite the given code using **efficient data structures** (e.g., HashMap, Set, Stack, Queue, Trie, etc.).  
   - Ensure the optimized version has **better time & space complexity**.  
   - Clearly format the optimized solution.
   - not provide main function.

2️⃣ **Normal Code Using Full Logic (Conditions, Loops, Functions, Switch, etc.)** 📖  
   - Rewrite the code using a **pure logical approach** (without extra data structures).  
   - Use only **loops, conditions, functions, and switch statements** where applicable.  
   - Ensure the code remains correct and understandable.
   - not provide main function.

3️⃣ **Code Review – Correct OR Not?** ✅  
   - Simply state if the **original code is correct or incorrect**.  
   - If incorrect, provide a **brief explanation** of what is wrong.  
   - Strictly: Not Only Consider Only The Test Case Present In Question but Also Consider Related All Test Cases To That Question.
   - & Also Say to User Below of There Code Review For Which Text Case Ans Is Wrong.

4️⃣ ** Output of Code if in Readable format because is show in a box of width 500px & height 600 px but box is scrollable to y axis** 📝`;

export const QnsPROMPT1 = `Generate a well-structured DSA-style coding problem labeled as 'Dev-DSA Question:' instead of 'LeetCode-style
            coding problem:'. The problem should be based on the selected question `;

export const QnsPROMPT2 = ` and cover concepts related to the DSA topic`;

export const QnsPROMPT3 = `. Ensure that the problem statement is clear, concise, and formatted professionally, including constraints 
            and example cases if necessary. Do not provide the solution or function signature.`;

export const MOCK_QNS = `Given an array of integers nums and an integer target, return indices of the two numbers such that they add 
            up to target. You may assume that each input would have exactly one solution.
            Example:
                Input: nums = [2,7,11,15], target = 9
                Output: [0,1]`;

export const DevHeader = () => {
  return (
    <>
      <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-400 drop-shadow-lg">
        📚 DSA Practice Sheet
      </h1>
      <div className="text-center mb-3">
        <pre className="text-wrap">
          Next Level Open's When Complete Previous Overall Level With Each Topic
          Questions:
        </pre>
      </div>
    </>
  );
};

export const topics = [
  [
    "Arrays & Strings",
    "Linked List",
    "Stacks & Queues",
    "Recursion & Backtracking",
    "Binary Search & Searching",
  ],
  [
    "Sorting Algorithms",
    "Trees & BST",
    "Graphs (BFS, DFS)",
    "Dynamic Programming (DP)",
    "Bit Manipulation",
  ],
];

export const systemDesignTopics = [
  [
    "System Design & Scalability",
    "OOD & SOLID Principles",
    "Greedy Algorithms",
    "Divide & Conquer",
    "Graph Algorithms",
  ],
  [
    "Concurrency & Parallel Computing",
    "Cache & DB Indexing",
    "Trie & String Algorithms",
    "Heap & Priority Queue",
    "OS Concepts",
  ],
];

// export  const articles = [
//     {
//       source: { id: "the-verge", name: "The Verge" },
//       author: "Tom Warren, Emma Roth",
//       title: "OpenAI announces GPT-4.5, warns it’s not a frontier AI model - The Verge",
//       description: "OpenAI is launching its next major AI model. Codenamed Orion, GPT-4.5 is the latest AI model from OpenAI, but it’s not a frontier one.",
//       url: "https://www.theverge.com/news/620021/openai-gpt-4-5-orion-ai-model-release",
//       urlToImage: "https://platform.theverge.com/wp-content/uploads/sites/2/2025/02/cfRYp0nItZ8-HD.jpg",
//       publishedAt: "2025-02-27T19:39:21Z",
//       content: "OpenAIs newest and largest model is being released as a research preview...",
//     },
//     {
//       source: { id: "associated-press", name: "Associated Press" },
//       author: null,
//       title: "Apple will fix iPhone glitch that suggests replacing the word ‘racist’ with ‘Trump’ - The Associated Press",
//       description: "Apple says it’s fixing a bug with its dictation feature on some iPhones...",
//       url: "https://apnews.com/article/apple-iphone-racist-trump-glitch-d80f88d69f6ceac585904f2faa2a9212",
//       urlToImage: "https://dims.apnews.com/dims4/default/446d7d2/2147483647/strip/true/crop/5670x3189+0+295/resize/1440x810/",
//       publishedAt: "2025-02-26T19:02:00Z",
//       content: "LONDON (AP) Apple is fixing a bug...",
//     },
//   ];

// 🚀 Difficulty Levels

export const levels = [
  "🔥 Level 1: Beginner",
  "🚀 Level 2: Medium Challenger",
  "🔥 Level 3: Middle Man Warrior",
  "🦸‍♂️ Level 4: Super Hero / Hard Boy",
];

export const DevDSAQuestions = {
  "🔥 Level 1: Beginner": {
    "📌 Arrays & Strings": [
      "Two Sum (LeetCode 1)",
      "Best Time to Buy and Sell Stock (LeetCode 121)",
      "Rotate Array (LeetCode 189)",
      "Reverse a String (LeetCode 344)",
      "Move Zeroes (LeetCode 283)",
      "Find the Duplicate Number (LeetCode 287)",
      "Longest Substring Without Repeating Characters (LeetCode 3)",
      "Maximum Subarray (LeetCode 53)",
      "Merge Sorted Arrays (LeetCode 88)",
      "Group Anagrams (LeetCode 49)",
      "Remove Duplicates from Sorted Array (LeetCode 26)",
      "Find the Missing Number (LeetCode 268)",
      "Pascal’s Triangle (LeetCode 118)",
      "Check if Strings are Rotations of Each Other",
      "String Compression (LeetCode 443)",
      "Valid Anagram (LeetCode 242)",
      "Implement strStr() / KMP Algorithm",
      "Longest Common Prefix (LeetCode 14)",
      "Palindrome Check",
      "Reverse Words in a String (LeetCode 151)",
      "Minimum Window Substring (LeetCode 76)",
      "Find First and Last Position in Sorted Array (LeetCode 34)",
      "Longest Palindromic Substring (LeetCode 5)",
      "Word Break Problem (LeetCode 139)",
      "Implement atoi() (LeetCode 8)",
    ],
    "📌 Linked List": [
      "Reverse a Linked List (LeetCode 206)",
      "Detect Cycle in a Linked List (LeetCode 141)",
      "Merge Two Sorted Linked Lists (LeetCode 21)",
      "Remove N-th Node from End (LeetCode 19)",
      "Intersection of Two Linked Lists (LeetCode 160)",
      "Copy List with Random Pointer (LeetCode 138)",
      "Sort a Linked List (LeetCode 148)",
      "Add Two Numbers (LeetCode 2)",
      "Delete Node in a Linked List (LeetCode 237)",
      "Swap Nodes in Pairs (LeetCode 24)",
      "Reverse Nodes in K-Groups (LeetCode 25)",
      "Flatten a Multilevel Doubly Linked List (LeetCode 430)",
      "Remove Duplicates from Sorted List (LeetCode 83)",
      "Rotate List (LeetCode 61)",
      "LRU Cache Implementation (LeetCode 146)",
      "Merge K Sorted Linked Lists (LeetCode 23)",
      "Reverse a Doubly Linked List",
      "Find Middle of Linked List",
      "Clone a Linked List with Random Pointers",
      "Check if a Linked List is Palindrome",
    ],
    "📌 Stacks & Queues": [
      "Implement Stack using Queues (LeetCode 225)",
      "Implement Queue using Stacks (LeetCode 232)",
      "Valid Parentheses (LeetCode 20)",
      "Min Stack (LeetCode 155)",
      "Largest Rectangle in Histogram (LeetCode 84)",
      "Daily Temperatures (LeetCode 739)",
      "Next Greater Element (LeetCode 496)",
      "Evaluate Reverse Polish Notation (LeetCode 150)",
      "Implement a Circular Queue",
      "Design a Monotonic Stack",
      "Implement Deque",
      "Sliding Window Maximum (LeetCode 239)",
      "Decode String (LeetCode 394)",
      "Simplify Path (LeetCode 71)",
      "Implement a Min Heap",
      "Stock Span Problem",
      "Next Smaller Element",
      "Largest Area in Histogram",
      "Check Balanced Parentheses",
      "Basic Calculator II (LeetCode 227)",
    ],
    "📌 Binary Search & Sorting": [
      "Binary Search Implementation",
      "First Bad Version (LeetCode 278)",
      "Find Peak Element (LeetCode 162)",
      "Search in Rotated Sorted Array (LeetCode 33)",
      "Find Median of Two Sorted Arrays (LeetCode 4)",
      "Merge Sort",
      "Quick Sort",
      "Count Inversions in an Array",
      "Dutch National Flag Problem",
      "Heap Sort",
      "Bucket Sort",
      "Radix Sort",
      "Counting Sort",
      "Find K Closest Elements (LeetCode 658)",
      "Kth Largest Element in an Array (LeetCode 215)",
    ],
  },
  "🚀 Level 2: Medium Challenger": {
    "📌 Recursion & Backtracking": [
      "Generate Parentheses (LeetCode 22)",
      "N-Queens Problem (LeetCode 51)",
      "Sudoku Solver (LeetCode 37)",
      "Word Search (LeetCode 79)",
      "Rat in a Maze Problem",
      "Combination Sum I & II (LeetCode 39, 40)",
      "Palindrome Partitioning (LeetCode 131)",
      "Letter Combinations of a Phone Number (LeetCode 17)",
      "Permutations I & II (LeetCode 46, 47)",
      "Subsets I & II (LeetCode 78, 90)",
      "Restore IP Addresses (LeetCode 93)",
      "Knight’s Tour Problem",
      "M Coloring Problem (Graph Coloring)",
      "Word Break II (LeetCode 140)",
      "Print all Palindromic Partitions of a String",
      "Find All Paths in a Matrix",
      "Hamiltonian Path and Cycle",
      "Remove Invalid Parentheses (LeetCode 301)",
      "Expression Add Operators (LeetCode 282)",
      "Matchsticks to Square (LeetCode 473)",
    ],

    "📌 Trees & Binary Search Trees (BST)": [
      "Lowest Common Ancestor of a BST (LeetCode 235)",
      "Lowest Common Ancestor of a Binary Tree (LeetCode 236)",
      "Diameter of Binary Tree (LeetCode 543)",
      "Binary Tree Right Side View (LeetCode 199)",
      "Convert Sorted Array to BST (LeetCode 108)",
      "Binary Tree Zigzag Level Order Traversal (LeetCode 103)",
      "Construct Binary Tree from Inorder and Postorder Traversal (LeetCode 106)",
      "Construct Binary Tree from Preorder and Inorder Traversal (LeetCode 105)",
      "Check if a Tree is a Subtree of Another Tree (LeetCode 572)",
      "Flatten Binary Tree to Linked List (LeetCode 114)",
      "Validate Binary Search Tree (LeetCode 98)",
      "Kth Smallest Element in a BST (LeetCode 230)",
      "Convert BST to Greater Tree (LeetCode 538)",
      "Find Mode in Binary Search Tree (LeetCode 501)",
      "Binary Tree Maximum Path Sum (LeetCode 124)",
      "Recover Binary Search Tree (LeetCode 99)",
      "Inorder Successor in BST (LeetCode 285)",
      "Serialize and Deserialize Binary Tree (LeetCode 297)",
      "Sum Root to Leaf Numbers (LeetCode 129)",
      "Find Duplicate Subtrees (LeetCode 652)",
    ],

    "📌 Graphs": [
      "Graph Valid Tree (LeetCode 261)",
      "Number of Islands (DFS/BFS) (LeetCode 200)",
      "Rotting Oranges (Multi-Source BFS) (LeetCode 994)",
      "Course Schedule I & II (Topological Sort) (LeetCode 207, 210)",
      "Word Ladder (BFS) (LeetCode 127)",
      "Graph Cycle Detection (DFS/BFS, Directed & Undirected)",
      "Dijkstra’s Algorithm (Shortest Path in Weighted Graph)",
      "Floyd Warshall Algorithm (All Pairs Shortest Path)",
      "Prim’s Algorithm (Minimum Spanning Tree)",
      "Kruskal’s Algorithm (Minimum Spanning Tree)",
      "Bellman-Ford Algorithm (Single Source Shortest Path)",
      "Find Bridges in a Graph (Tarjan’s Algorithm)",
      "Find Articulation Points in a Graph",
      "Check if Graph is Bipartite (LeetCode 785)",
      "Find Strongly Connected Components (Kosaraju’s Algorithm)",
      "Find Shortest Path in an Unweighted Graph (BFS)",
      "Count Connected Components in an Undirected Graph (LeetCode 323)",
      "Water Jug Problem (Graph BFS/DFS)",
      "Snakes and Ladders (Graph BFS) (LeetCode 909)",
      "Alien Dictionary (Topological Sort) (LeetCode 269)",
    ],

    "📌 Dynamic Programming (DP)": [
      "0/1 Knapsack Problem",
      "Coin Change I & II (LeetCode 322, 518)",
      "Longest Increasing Subsequence (LeetCode 300)",
      "House Robber I & II (LeetCode 198, 213)",
      "Best Time to Buy and Sell Stock with Cooldown (LeetCode 309)",
      "Longest Palindromic Subsequence (LeetCode 516)",
      "Minimum Edit Distance (LeetCode 72)",
      "Unique Paths I & II (LeetCode 62, 63)",
      "Partition Equal Subset Sum (LeetCode 416)",
      "Longest Common Subsequence (LeetCode 1143)",
      "Wildcard Matching (LeetCode 44)",
      "Regular Expression Matching (LeetCode 10)",
      "Burst Balloons (LeetCode 312)",
      "Interleaving String (LeetCode 97)",
      "Scramble String (LeetCode 87)",
      "Russian Doll Envelopes (LeetCode 354)",
      "Number of Longest Increasing Subsequences (LeetCode 673)",
      "Maximum Subarray (Kadane’s Algorithm) (LeetCode 53)",
      "Decode Ways (LeetCode 91)",
      "Jump Game I & II (LeetCode 55, 45)",
    ],

    "📌 Bit Manipulation": [
      "Single Number I, II, III (LeetCode 136, 137, 260)",
      "Power of Two (LeetCode 231)",
      "Hamming Distance (LeetCode 461)",
      "Counting Bits (LeetCode 338)",
      "Reverse Bits (LeetCode 190)",
      "Missing Number (LeetCode 268)",
      "Sum of Two Integers Without Using + or - (LeetCode 371)",
      "Number of 1 Bits (LeetCode 191)",
      "Gray Code (LeetCode 89)",
      "Divide Two Integers Without Using / or % (LeetCode 29)",
      "XOR Queries of a Subarray (LeetCode 1310)",
      "Find XOR of Numbers From 1 to N",
      "Swap Two Numbers Without Temporary Variable",
      "Find Maximum XOR of Two Numbers in an Array (LeetCode 421)",
      "AND Product of Two Numbers",
      "Find the Two Non-Repeating Elements in an Array",
      "Check if a Number is a Power of Four (LeetCode 342)",
      "Maximum Product of Word Lengths (LeetCode 318)",
      "Check if a Number is a Power of Two (Without Loop/Recursion)",
      "Total Hamming Distance (LeetCode 477)",
    ],
  },
  "🔥 Level 3: Middle Man Warrior": {
    "📌 Advanced Graph Algorithms": [
      "Bellman-Ford Algorithm (LeetCode 787 – Cheapest Flights Within K Stops)",
      "Floyd-Warshall Algorithm (All-Pairs Shortest Path)",
      "Dijkstra’s Algorithm (Single Source Shortest Path)",
      "A* Search Algorithm (Pathfinding in AI & Robotics)",
      "Johnson’s Algorithm for All-Pairs Shortest Path",
      "Kruskal’s Algorithm (Minimum Spanning Tree)",
      "Prim’s Algorithm (Minimum Spanning Tree)",
      "Tarjan’s Algorithm for Strongly Connected Components",
      "Kosaraju’s Algorithm for Strongly Connected Components",
      "Eulerian Path and Eulerian Circuit",
      "Hamiltonian Path and Cycle",
      "Bridges in Graph (Tarjan’s Algorithm)",
      "Articulation Points (Cut Vertices in a Graph)",
      "Topological Sorting using Kahn’s Algorithm",
      "Bipartite Graph Check using DFS & BFS",
      "Graph Coloring Algorithm (M-Coloring Problem)",
      "Network Flow (Ford-Fulkerson Algorithm)",
      "Edmonds-Karp Algorithm (Max Flow in a Graph)",
      "Hungarian Algorithm (Optimal Assignment Problem)",
      "2-SAT Problem (Graph-Based Boolean Satisfiability)",
    ],
    "📌 Advanced Dynamic Programming": [
      "Matrix Chain Multiplication (MCM DP)",
      "Egg Dropping Puzzle (Super Egg Drop) (LeetCode 887)",
      "Rod Cutting Problem (Knapsack Variation)",
      "Optimal BST Problem (Cost Minimization in BST Search)",
      "Word Break Problem (Dynamic Programming + Trie) (LeetCode 139)",
      "Palindrome Partitioning (Min Cuts for Palindromes) (LeetCode 132)",
      "Edit Distance (String DP) (LeetCode 72)",
      "WildCard Matching (Regex Matching using DP) (LeetCode 44)",
      "Regular Expression Matching (Hard Level) (LeetCode 10)",
      "Longest Palindromic Subsequence (String DP) (LeetCode 516)",
      "Longest Common Subsequence (LCS Variation) (LeetCode 1143)",
      "Printing Shortest Common Supersequence (SCS DP)",
      "Subset Sum Problem (DP + Bit Manipulation)",
      "Partition Equal Subset Sum (Knapsack Variation) (LeetCode 416)",
      "Count of Distinct Subsequences in a String (LeetCode 115)",
      "Maximum Length of Pair Chain (LeetCode 646)",
      "Number of Ways to Paint a Fence",
      "Burst Balloons (DP with Interval Partitioning) (LeetCode 312)",
      "Jump Game Hard (Minimum Jumps to End) (LeetCode 45)",
    ],
    "📌 Trie & String Algorithms": [
      "Trie Data Structure Implementation (Insert, Search, Delete)",
      "Longest Common Prefix using Trie (LeetCode 14)",
      "Word Search II (Trie + DFS) (LeetCode 212)",
      "Autocomplete System (Trie + Priority Queue)",
      "Phone Directory using Trie",
      "Rabin-Karp Algorithm (String Matching using Hashing)",
      "KMP Algorithm (Pattern Matching)",
      "Z-Algorithm (Pattern Matching in Linear Time)",
      "Suffix Array & Suffix Tree Basics",
      "Aho-Corasick Algorithm (Multi-Pattern Search in a String)",
      "Manacher’s Algorithm (Longest Palindromic Substring in Linear Time)",
      "Minimum Window Substring (Sliding Window + Hashing) (LeetCode 76)",
      "Find All Anagrams in a String (Sliding Window + HashMap) (LeetCode 438)",
      "String Compression (Run-Length Encoding) (LeetCode 443)",
      "Valid Parenthesis String (Backtracking + DP) (LeetCode 678)",
      "Longest Repeating Substring using Binary Search (LeetCode 1062)",
      "Find the Smallest Window in a String Containing All Characters of Another String",
      "Lexicographically Smallest String After K Swaps",
      "Word Ladder II (BFS + Backtracking) (LeetCode 126)",
      "Count Distinct Substrings using Suffix Trie",
    ],
    "📌 Concurrency & Parallel Computing": [
      "Producer-Consumer Problem (Multithreading)",
      "Readers-Writers Problem (Concurrency Control)",
      "Dining Philosophers Problem (Deadlock Prevention)",
      "Implementing Thread Pool in Java/C++",
      "Mutex vs Semaphore (When to Use Which?)",
      "Deadlock Detection Algorithm in OS",
      "Implementing a Barrier Synchronization Mechanism",
      "Parallel Merge Sort (Divide and Conquer with Multithreading)",
      "Parallel QuickSort Algorithm (Threaded Sorting)",
      "Using Locks & Condition Variables (Concurrency Synchronization)",
      "Multi-Threaded Web Scraper (Python & Java)",
      "Building a Concurrent Web Server (Load Balancing Approach)",
      "Memory Management in Multi-Threaded Applications",
      "Cache Coherency Problem in Parallel Systems",
      "Implementing Atomic Operations using Compare-and-Swap (CAS)",
      "Lazy Initialization with Thread Safety",
      "Parallel BFS & DFS in Graphs",
      "Job Scheduling Algorithm for Multi-Core Systems",
      "Optimizing Data Pipeline Performance using Parallel Processing",
      "Lock-Free Data Structures (Designing Concurrent HashMaps)",
    ],
    "📌 System Design Concepts": [
      "Load Balancing Algorithm (Consistent Hashing, Least Connections, Round Robin, etc.)",
      "CAP Theorem & Trade-offs (Consistency vs Availability)",
      "Sharding vs Replication in Database Scaling",
      "Design a URL Shortener (System Design)",
      "Design a Scalable Rate Limiter (Token Bucket, Leaky Bucket)",
      "Design a Cache System (LRU, LFU, Redis Concepts)",
      "Designing a Distributed Message Queue (Kafka, RabbitMQ Concepts)",
      "Implementing Microservices Architecture (gRPC, REST, Event-Driven Design)",
      "Designing a Distributed File System like Google Drive",
      "Designing an Online Collaborative Document Editor (Google Docs)",
      "Scaling a Video Streaming Service (Netflix, YouTube Scaling Design)",
      "Designing an API Gateway (Reverse Proxy & Load Balancer Concepts)",
      "Data Partitioning Strategies (Horizontal vs Vertical Scaling)",
      "Eventual Consistency & Strong Consistency (Database Design Trade-offs)",
      "Designing an E-commerce Order Management System",
      "Optimizing Search Query Performance (Indexing, Caching, Query Optimization)",
      "Implementing Leader Election in a Distributed System",
      "Choosing the Right Database for a Use Case (SQL vs NoSQL)",
      "Designing a Logging & Monitoring System (ELK Stack, Prometheus, Grafana)",
      "Cloud Architecture: Scaling a Multi-Tenant SaaS Application",
    ],
  },
  "🦸‍♂️ Level 4: Super Hero / Hard Boy": {
    "📌 System Design Scalability": [
      "Designing Uber’s Ride-Matching Algorithm (GeoHashing, Load Balancing)",
      "Designing Netflix’s Video Streaming Architecture (CDNs, Adaptive Bitrate Streaming)",
      "Designing WhatsApp’s Messaging System (End-to-End Encryption, Queuing)",
      "Designing YouTube’s Video Upload & Streaming Infrastructure",
      "How to Design a Large-Scale Distributed Caching System? (Redis, Memcached)",
      "How to Design Google Docs for Real-Time Collaborative Editing?",
      "Scaling Facebook’s News Feed (Ranking & Personalization)",
      "Designing a Large-Scale Notification System (Push, SMS, Email, WebSockets)",
      "Designing a Distributed Log Management System (ELK, Kafka, Cloud Logging)",
      "Designing a Web Search Engine like Google (Indexing, Ranking, Crawling)",
      "How to Handle Billions of Concurrent Users in a Web Service?",
      "How to Design an Online Multiplayer Game Server (Fortnite, PUBG)?",
      "Designing a High-Performance Load Balancer (HAProxy, Envoy, Nginx)",
      "How to Design a Large-Scale Machine Learning Pipeline?",
      "Building a Fault-Tolerant Cloud Storage System (Google Drive, Dropbox)",
      "Designing a Ride-Pooling System like UberPool (Dynamic Programming + Graphs)",
      "Building a Global Chat System like Slack (Pub/Sub, WebSockets, Event-Driven Arch.)",
      "Designing an AI-Based Personal Assistant (Siri, Google Assistant, Alexa)",
      "Scaling an IoT Device Network (Smart Homes, Autonomous Cars)",
      "Architecting an Edge Computing System for Real-Time Analytics",
    ],
    "📌 Operating System Concepts": [
      "Virtual Memory – Page Replacement Algorithms (LRU, FIFO, Optimal)",
      "Process Scheduling – Round Robin, Shortest Job First (SJF), Multilevel Queue",
      "Thread Synchronization – Mutex vs Semaphore, Deadlock Prevention",
      "Process vs Thread – Multi-threading vs Multi-processing Trade-offs",
      "Implementing a Custom Memory Allocator (Malloc, Free, Garbage Collection)",
      "Understanding NUMA (Non-Uniform Memory Access) in Multi-Core Systems",
      "Building a Custom File System (File Allocation, Journaling, RAID Levels)",
      "Distributed Systems & Consensus Algorithms (Paxos, Raft, Byzantine Fault Tolerance)",
      "Inter-Process Communication (Pipes, Shared Memory, Message Queues, RPC)",
      "Implementing a Multi-threaded Web Server (Handling Concurrent Requests)",
      "How Kernel Manages Processes & Memory (Linux Kernel, Windows NT Kernel)",
      "Understanding Microservices & Container Orchestration (Docker, Kubernetes)",
      "How Modern CPUs Handle Context Switching & Process Scheduling?",
      "Designing an OS-Level Thread Pool for High Performance Computing",
      "Understanding Hypervisors & Virtualization (VMware, Xen, KVM, Hyper-V)",
      "File System Internals – Inodes, Metadata, Disk Scheduling Algorithms",
      "Understanding Cgroups & Namespaces (Linux Containerization Concepts)",
      "Deep Dive into Disk I/O Performance (SSD vs HDD, File System Caching)",
      "How OS Handles Interrupts & System Calls?",
      "Security & Sandboxing in Operating Systems (Seccomp, AppArmor, SELinux)",
    ],
    "📌 Cache Database Indexing": [
      "Implementing an LRU Cache (LeetCode 146, Doubly Linked List + HashMap)",
      "Understanding Bloom Filters (Probabilistic Data Structures for Fast Lookups)",
      "B+ Trees & Red-Black Trees in Database Indexing",
      "Designing a Write-Ahead Log (WAL) for Database Transactions",
      "Consistent Hashing (Designing Scalable Distributed Caches)",
      "Sharding & Partitioning in NoSQL Databases (MongoDB, Cassandra, DynamoDB)",
      "Comparing LSM Trees vs B-Trees (Performance & Trade-offs)",
      "Understanding Log-Structured Merge (LSM) Trees in RocksDB, LevelDB",
      "Designing a High-Performance Key-Value Store (Like Redis, Memcached)",
      "Cache Coherency Protocols in Multi-Core Processors",
      "Understanding Database Query Optimization (Indexing, Joins, Execution Plans)",
      "Column-Oriented vs Row-Oriented Databases (OLAP vs OLTP)",
      "How SSDs Optimize Database Performance (Wear Leveling, TRIM, Garbage Collection)",
      "Database Locking Mechanisms – Pessimistic vs Optimistic Locking",
      "Distributed Database Consistency Models (Eventually Consistent vs Strongly Consistent)",
      "How to Scale a Search Engine using Inverted Index & TF-IDF Ranking?",
      "Query Caching Strategies in High-Performance Databases",
      "How Does a Time-Series Database Work? (InfluxDB, Prometheus, TimescaleDB)",
      "Building a Serverless Database Architecture for Auto-Scaling Applications",
      "Designing a High-Throughput Event-Driven Database Architecture",
    ],
    "📌 Advanced Graph Theory": [
      "Max Flow Problem (Edmonds-Karp Algorithm, Dinic’s Algorithm)",
      "Minimum Spanning Tree (Kruskal’s Algorithm, Prim’s Algorithm)",
      "PageRank Algorithm (How Google Ranks Websites in Search Engine)",
      "Hopcroft-Karp Algorithm for Maximum Bipartite Matching",
      "Graph Theory in AI – Monte Carlo Tree Search (MCTS) in AlphaGo",
      "Graph Compression Algorithms for Web Crawlers",
      "Designing an Efficient Graph Database (Neo4j, ArangoDB, JanusGraph)",
      "Graph Partitioning Techniques in Distributed Computing",
      "Finding Articulation Points & Bridges in a Graph (Network Reliability)",
      "Tree Decomposition Algorithms (Caterpillar Trees, Dynamic Trees)",
      "Graph Representation in Quantum Computing (Quantum Walks, QC Algorithms)",
      "Graph Theoretical Approach to Cybersecurity (Intrusion Detection Systems)",
      "Clique Problems in Graph Theory (Maximum Clique, Bron-Kerbosch Algorithm)",
      "Graph Algorithms for Fraud Detection in Large-Scale Financial Systems",
      "Modeling Graphs in DNA Sequencing (Genome Assembly using de Bruijn Graphs)",
      "Social Network Analysis using Graph Algorithms (Community Detection, Influence Maximization)",
      "Finding Eulerian & Hamiltonian Paths in Graphs",
      "Shortest Path in a Weighted Graph (Floyd-Warshall, Johnson’s Algorithm)",
      "Graph Isomorphism Problem & Applications in Cryptography",
      "Algorithms for Graph Visualization (Force-Directed Graph Layouts)",
    ],
    "📌 Machine Learning AI System Design": [
      "Building a Scalable ML Pipeline (Feature Engineering, Model Training, Deployment)",
      "Designing a Recommendation System (Collaborative Filtering, Matrix Factorization)",
      "How Google’s Search Ranking Algorithm Works? (BERT, PageRank, TF-IDF)",
      "Deep Learning Infrastructure at Scale (Distributed Training with TensorFlow/Kubernetes)",
      "Data Warehousing for AI/ML Workloads (BigQuery, Snowflake, Redshift)",
      "Designing a Scalable AI-Based Fraud Detection System",
      "Scalability Challenges in Real-Time NLP Systems (ChatGPT, Bard, Gemini AI)",
      "Hyperparameter Optimization at Scale (Bayesian Optimization, Grid Search)",
      "Building a Low-Latency Real-Time Speech Recognition System",
      "Data Engineering Best Practices for AI-Driven Products",
      "Building an AI Chatbot with Context Awareness",
      "Developing an AI-Powered Image Recognition System",
      "Optimizing Deep Neural Networks for Low Latency",
      "Scaling a Real-Time Object Detection System",
      "Deploying AI Models on Edge Devices",
      "Building a Large-Scale Recommendation Engine",
      "Designing an AI-Based Sentiment Analysis System",
      "Implementing Self-Learning AI Agents",
      "Handling Large-Scale Data in Machine Learning Workloads",
      "Optimizing AI Inference for Real-Time Predictions",
    ],
  },
};

// Joke API:
export const fetchProgrammingJoke = async () => {
  try {
    const res = await fetch("https://v2.jokeapi.dev/joke/Programming");
    const data = await res.json();

    let jokeText = "";

    if (data.type === "single") {
      jokeText = data.joke;
    } else if (data.type === "twopart") {
      jokeText = `${data.setup} ... ${data.delivery}`;
    } else {
      console.warn("Unsupported joke format:", data);
      return;
    }

    // ✅ Speak the joke using speech synthesis
    const utterance = new SpeechSynthesisUtterance(jokeText);
    utterance.rate = 1;
    utterance.pitch = 1;

    // Wait for voices to be loaded
    const speakAfterVoicesReady = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        utterance.voice =
          voices.find((v) => v.lang.startsWith("en")) || voices[0];
        window.speechSynthesis.speak(utterance);
      } else {
        // Try again shortly
        setTimeout(speakAfterVoicesReady, 100);
      }
    };

    speakAfterVoicesReady();

    // Optional alert for debug (can remove)
    alert(jokeText);
  } catch (err) {
    console.error("Joke fetch failed:", err);
  }
};

// /utils/fetchApiInstructions.js
export const fetchApiSteps = async (apiName) => {
  const prompt = `
You are an assistant helping developers use public APIs.

Give exactly 5 clear steps for using the "${apiName}" API.

If the API requires an API key, explain how to get it.
If it's a public/free API without a key, include a direct usable sample endpoint.

Always return in this format:

Step 1: ...
Step 2: ...
Step 3: ...
Step 4: ...
Step 5: ...

If public, append this (on new line):
__API_SAMPLE__: https://example.com/sample-endpoint
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return text;
  } catch (error) {
    console.error("Gemini generation failed:", error);
    return "❌ Error fetching instructions.";
  }
};

// JSDoc Tags Autocomplete
const tagOptions = [
  "constructor",
  "deprecated",
  "link",
  "param",
  "returns",
  "type",
].map((tag) => ({ label: "@" + tag, type: "keyword" }));

function completeJSDoc(context) {
  let nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1);
  if (
    nodeBefore.name !== "BlockComment" ||
    !/\/\*\*[\s\S]*\*\//.test(
      context.state.sliceDoc(nodeBefore.from, nodeBefore.to)
    ) // ✅ Improved JSDoc check
  ) {
    return null;
  }

  let textBefore = context.state.sliceDoc(nodeBefore.from, context.pos);
  let tagBefore = /@\w*$/.exec(textBefore);
  if (!tagBefore && !context.explicit) return null;

  return {
    from: tagBefore ? nodeBefore.from + tagBefore.index : context.pos,
    options: tagOptions,
    validFor: /^(@\w*)?$/,
  };
}

// Custom Autocomplete
function myCompletions(context) {
  let word = context.matchBefore(/\w*/);
  if (!word || (!context.explicit && word.text.length < 2)) return null; // ✅ Prevents errors

  return {
    from: word.from,
    options: [
      { label: "match", type: "keyword" },
      { label: "hello", type: "variable", info: "(World)" },
      { label: "magic", type: "text", apply: "⠁⭒*.✩.*⭒⠁", detail: "macro" },
    ],
  };
}

export { completeJSDoc, myCompletions };

export async function analyzeCode(codeInput) {
  const prompt = `
You're a software expert that breaks down code into steps.

Given this code:
\`\`\`
${codeInput}
\`\`\`

Generate a structured breakdown:
1. Pseudocode
2. Time and Space Complexity (Best, Average, Worst) with explanation
3. Visual Steps (with array/pointer visualization or flowcharts)
4. Summary Table (Sorted Input?, Use Case, etc.)

Return JSON:
{
  pseudocode: "...",
  timeComplexity: { Best: "...", Average: "...", Worst: "..." },
  spaceComplexity: "...",
  explanation: "...",
  visualSteps: [ { description: "...", diagram: "...", pointers: {...} } ],
  summary: { "Use Case": "...", ... }
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Try to extract JSON from the text
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Failed to extract JSON from Gemini response");

  return JSON.parse(match[0]);
}

export const deleteMediaFromFirebase = async (publicId) => {
  const db = getDatabase();
  const dbRef = ref(db, "postMedia");
  const snapshot = await get(dbRef);

  const updates = {};

  snapshot.forEach((postSnap) => {
    const postId = postSnap.key;
    const postData = postSnap.val();

    if (postData.media) {
      const matchingMediaKeys = Object.keys(postData.media).filter((key) => {
        const mediaItem = postData.media[key];
        return mediaItem.public_id === publicId;
      });

      if (matchingMediaKeys.length > 0) {
        // Step 1: Delete the matching media items
        matchingMediaKeys.forEach((key) => {
          updates[`postMedia/${postId}/media/${key}`] = null;
        });

        // Step 2: If after deletion media would be empty, delete media object too
        const mediaKeysCount = Object.keys(postData.media).length;
        if (mediaKeysCount === matchingMediaKeys.length) {
          updates[`postMedia/${postId}/media`] = null;
        }

        // Step 3: Optional — Clean whole postMedia/<postId> if fully empty
        const onlyHasIdAndUser =
          Object.keys(postData).length <= 3 &&
          postData.id &&
          postData.userId &&
          mediaKeysCount === matchingMediaKeys.length;

        if (onlyHasIdAndUser) {
          updates[`postMedia/${postId}`] = null;
        }
      }
    }
  });

  if (Object.keys(updates).length === 0) {
    return {
      deleted: false,
      message: "No matching public_id found in Firebase.",
    };
  }

  await update(ref(db), updates);

  return {
    deleted: true,
    message: "✅ Media and any empty parents deleted successfully.",
    updates,
  };
};
