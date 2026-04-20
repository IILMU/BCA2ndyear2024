"use client";

export default function Books() {
  const books = [
    {
      title: "Word Power Made Easy",
      author: "Norman Lewis",
      level: "Vocabulary Improvement",
    },
    {
      title: "Wren & Martin English Grammar",
      author: "P.C. Wren & H. Martin",
      level: "Grammar",
    },
    {
      title: "The Alchemist",
      author: "Paulo Coelho",
      level: "Reading Fluency",
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      level: "Simple English Non-fiction",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 p-10 text-white">
      <h1 className="text-3xl font-bold mb-8">📚 Book Suggestions</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {books.map((book, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg"
          >
            <h2 className="text-xl font-semibold">{book.title}</h2>
            <p className="text-sm mt-2">Author: {book.author}</p>
            <p className="text-sm mt-2 text-purple-200">
              Focus: {book.level}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}