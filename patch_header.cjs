const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

const oldLogo = `<div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-violet-600/25 shrink-0">
          <span className="font-extrabold text-sm tracking-tight">CV</span>
        </div>`;
const newLogo = `<div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-violet-600/25 shrink-0 p-1.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M14 7.5c-1-1.5-3-2.5-5.5-2.5-3.5 0-6.5 3-6.5 6.5s3 6.5 6.5 6.5c2.5 0 4.5-1 5.5-2.5" />
            <path d="M11 7l4.5 8.5L20 7" />
          </svg>
        </div>`;

const oldTitle = `<span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-violet-100 text-violet-700 border border-violet-200 shrink-0">
              {t.appBadge}
            </span>`;
const newTitle = `{t.appBadge && (
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-violet-100 text-violet-700 border border-violet-200 shrink-0">
                {t.appBadge}
              </span>
            )}`;

code = code.replace(oldLogo, newLogo);
code = code.replace(oldTitle, newTitle);

fs.writeFileSync('src/components/Header.tsx', code);
console.log("Success");
