// 'use client';

// import { useSession, signIn } from 'next-auth/react';
// import Link from 'next/link';

// export default function HomePage() {
//   const { data: session } = useSession();

//   return (
//     // ✅ Tighten height, no scroll unless needed
//     <div className="flex flex-col items-center justify-center py-20 text-center px-4">

//       <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-700 mb-4">
//         {session ? `Welcome, ${session.user.name}!` : 'Welcome to Mini CRM'}
//       </h1>

//       <p className="text-lg text-gray-600 max-w-2xl mb-6">
//         A smart, modern customer relationship platform to help you manage segments,
//         deliver campaigns, and drive engagement intelligently.
//       </p>

//       {session ? (
//         <div className="flex gap-4">
//           <Link href="/dashboard">
//             <button className="bg-blue-600 text-white font-semibold px-6 py-2 rounded shadow hover:bg-blue-700 transition">
//               Go to Dashboard
//             </button>
//           </Link>
//           <Link href="/campaigns/create">
//             <button className="bg-green-600 text-white font-semibold px-6 py-2 rounded shadow hover:bg-green-700 transition">
//               Create Campaign
//             </button>
//           </Link>
//         </div>
//       ) : (
//         <button
//           onClick={() => signIn('google')}
//           className="bg-blue-600 text-white font-semibold px-6 py-2 rounded shadow hover:bg-blue-700 transition"
//         >
//           Sign in with Google
//         </button>
//       )}
//     </div>
//   );
// }

'use client';

import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';

export default function HomePage() {
  const { data: session, status } = useSession();

  // ...existing code...
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] text-center px-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-700 mb-4 break-words">
        {session ? `Welcome, ${session.user.name}!` : 'Welcome to Mini CRM'}
      </h1>

      <p className="text-base sm:text-lg text-gray-600 max-w-2xl mb-6">
        A smart customer relationship platform to manage customers and orders, segment audiences, run campaigns, and track performance insights.
      </p>

      {session ? (
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-blue-600 text-white font-semibold px-6 py-2 rounded shadow hover:bg-blue-700 transition">
                Go to Dashboard
              </button>
            </Link>
            <Link href="/campaigns/create" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-green-600 text-white font-semibold px-6 py-2 rounded shadow hover:bg-green-700 transition">
                Create Campaign
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <button
          onClick={() => signIn('google')}
          className="w-full sm:w-auto bg-blue-600 text-white font-semibold px-6 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
// ...existing code...
}
