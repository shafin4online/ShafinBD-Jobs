import React from 'react';

// Helper for Detail Items
export const DetailItem: React.FC<{
  label: string;
  value?: string;
  highlight?: boolean;
}> = ({ label, value, highlight }) => (
  <div
    className={`p-3 rounded-xl border ${
      highlight
        ? 'bg-emerald-50/50 border-emerald-200'
        : 'bg-slate-50 border-slate-200'
    }`}
  >
    <span className="text-[11px] font-bold text-slate-500 block mb-0.5">
      {label}
    </span>
    <span
      className={`font-extrabold block text-xs ${
        value ? 'text-slate-900' : 'text-slate-400 italic'
      }`}
    >
      {value || 'Not Provided'}
    </span>
  </div>
);

// Helper for Education Item Card
export const EducationCard: React.FC<{
  level: string;
  exam?: string;
  roll?: string;
  reg?: string;
  group?: string;
  board?: string;
  institute?: string;
  subject?: string;
  result?: string;
  year?: string;
  duration?: string;
  required?: boolean;
  optional?: boolean;
}> = ({
  level,
  exam,
  roll,
  reg,
  group,
  board,
  institute,
  subject,
  result,
  year,
  duration,
  optional,
}) => {
  const hasData = Boolean(exam && exam !== 'Select');

  return (
    <div
      className={`p-4 rounded-xl border text-xs space-y-2 ${
        hasData
          ? 'bg-slate-50 border-slate-200'
          : 'bg-slate-50/50 border-slate-200/60 opacity-80'
      }`}
    >
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
        <span className="font-bold text-slate-700 text-[11px]">
          {level} summary
        </span>
        {optional ? (
          <span className="text-[10px] font-bold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded">
            Optional / ঐচ্ছিক
          </span>
        ) : (
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
            Required / আবশ্যিক
          </span>
        )}
      </div>

      {hasData ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-1 text-slate-700">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">
              Exam:
            </span>{' '}
            <strong className="text-slate-900">{exam}</strong>
          </div>
          {roll && (
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">
                Roll No:
              </span>{' '}
              <strong className="text-slate-900">{roll}</strong>
            </div>
          )}
          {reg && (
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">
                Reg No:
              </span>{' '}
              <strong className="text-slate-900">{reg}</strong>
            </div>
          )}
          {group && (
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">
                Group/Subject:
              </span>{' '}
              <strong className="text-slate-900">{group}</strong>
            </div>
          )}
          {subject && (
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">
                Subject/Degree:
              </span>{' '}
              <strong className="text-slate-900">{subject}</strong>
            </div>
          )}
          {board && (
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">
                Board:
              </span>{' '}
              <strong className="text-slate-900">{board}</strong>
            </div>
          )}
          {institute && (
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">
                University/Inst:
              </span>{' '}
              <strong className="text-slate-900">{institute}</strong>
            </div>
          )}
          {result && (
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">
                Result:
              </span>{' '}
              <strong className="text-emerald-700 font-extrabold">
                {result}
              </strong>
            </div>
          )}
          {year && (
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">
                Passing Year:
              </span>{' '}
              <strong className="text-slate-900">{year}</strong>
            </div>
          )}
          {duration && (
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">
                Duration:
              </span>{' '}
              <strong className="text-slate-900">{duration}</strong>
            </div>
          )}
        </div>
      ) : (
        <p className="text-[11px] text-slate-400 font-medium py-1">
          {optional ? 'তথ্য প্রদান করা হয়নি (ঐচ্ছিক)' : 'তথ্য যুক্ত করা হয়নি'}
        </p>
      )}
    </div>
  );
};
