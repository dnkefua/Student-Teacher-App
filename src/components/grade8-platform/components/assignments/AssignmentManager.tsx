'use client';

import React, { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import {
  ClipboardList,
  Plus,
  Send,
  Trash2,
  GraduationCap,
  CheckCircle2,
  Clock,
  BookOpen,
  AlertCircle,
} from 'lucide-react';
import type { SubjectId, UnitId, Example } from '../../types';
import {
  type Assignment,
  type AssignmentItem,
  type AssignmentKind,
  createAssignment,
  deleteAssignment,
  getSubmission,
  listAssignments,
  listSubmissionsForAssignment,
  submitAssignment,
  subscribe,
} from '../../data/assignmentStore';

import { examplesData } from '../../data/curriculumData';
import { unit2Examples } from '../../data/unit2Data';
import { unit3Examples } from '../../data/unit3Data';
import { unit4Examples } from '../../data/unit4Data';
import {
  englishUnit1Examples,
  englishUnit2Examples,
  englishUnit3Examples,
  englishUnit4Examples,
  englishUnit5Examples,
} from '../../data/englishCurriculum';
import {
  scienceUnit1Examples,
  scienceUnit2Examples,
  scienceUnit3Examples,
  scienceUnit4Examples,
  scienceUnit5Examples,
  scienceUnit6Examples,
} from '../../data/scienceCurriculum';
import { glExams } from '../../data/glExams';

// ── Helpers ────────────────────────────────────────────────────────────

// Return the full pool of practice items available for a given subject + unit.
// Maths still uses `examplesData[unit]`, the other two split into per-subject
// banks. We surface the *id* and *title* / *problem* so the teacher can pick.
function poolFor(subject: SubjectId, unit: UnitId): Example[] {
  if (subject === 'math') {
    // examplesData is the flat list used by Unit 1; the other Maths units
    // each have their own bank.
    const byUnit: Record<UnitId, Example[]> = {
      unit1: examplesData,
      unit2: unit2Examples,
      unit3: unit3Examples,
      unit4: unit4Examples,
      unit5: [],
      unit6: [],
    };
    return byUnit[unit] || [];
  }
  if (subject === 'english') {
    const byUnit: Record<UnitId, Example[]> = {
      unit1: englishUnit1Examples,
      unit2: englishUnit2Examples,
      unit3: englishUnit3Examples,
      unit4: englishUnit4Examples,
      unit5: englishUnit5Examples,
      unit6: [],
    };
    return byUnit[unit] || [];
  }
  const byUnit: Record<UnitId, Example[]> = {
    unit1: scienceUnit1Examples,
    unit2: scienceUnit2Examples,
    unit3: scienceUnit3Examples,
    unit4: scienceUnit4Examples,
    unit5: scienceUnit5Examples,
    unit6: scienceUnit6Examples,
  };
  return byUnit[unit] || [];
}

// Use the assignment store as an external store so any change in any panel
// re-renders this one without prop drilling.
function useAssignments(): Assignment[] {
  return useSyncExternalStore(
    subscribe,
    () => listAssignments(),
    () => [],
  );
}

// ── Teacher view ──────────────────────────────────────────────────────

function TeacherView({ initialSubject }: { initialSubject: SubjectId }) {
  const assignments = useAssignments();
  const [subject, setSubject] = useState<SubjectId>(initialSubject);
  const [unit, setUnit] = useState<UnitId>('unit1');
  const [kind, setKind] = useState<AssignmentKind>('exercise');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueAt, setDueAt] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const pool = useMemo(() => poolFor(subject, unit), [subject, unit]);

  // Reset selection when subject/unit changes so we don't carry stale ids.
  useEffect(() => {
    setSelectedIds(new Set());
  }, [subject, unit, kind]);

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const canCreate = title.trim().length > 0 && selectedIds.size > 0;

  const submit = () => {
    if (!canCreate) return;
    const items: AssignmentItem[] =
      kind === 'exam'
        ? Array.from(selectedIds).map((id) => {
            const exam = glExams.find((e) => e.id === id);
            return { refId: id, label: exam?.title || id };
          })
        : Array.from(selectedIds).map((id) => {
            const ex = pool.find((p) => p.id === id);
            return { refId: id, label: ex ? `${ex.title}: ${ex.problem}` : id };
          });

    createAssignment({
      title: title.trim(),
      kind,
      subject,
      unit,
      items,
      dueAt,
      createdBy: 'teacher',
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setNotes('');
    setSelectedIds(new Set());
  };

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <ClipboardList className="h-5 w-5 text-blue-500" />
              Create Assignment
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Pick items from the curriculum and post them to the class. Students see new
              assignments instantly in their panel.
            </p>
          </div>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
            Teacher
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Subject
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as SubjectId)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm normal-case text-slate-800 outline-none focus:border-blue-500"
            >
              <option value="math">Maths</option>
              <option value="english">English</option>
              <option value="science">Science</option>
            </select>
          </label>
          <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Unit
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as UnitId)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm normal-case text-slate-800 outline-none focus:border-blue-500"
            >
              {(['unit1', 'unit2', 'unit3', 'unit4', 'unit5', 'unit6'] as UnitId[]).map((u) => (
                <option key={u} value={u}>{u.replace('unit', 'Unit ')}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Type
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as AssignmentKind)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm normal-case text-slate-800 outline-none focus:border-blue-500"
            >
              <option value="exercise">Exercises</option>
              <option value="exam">Exam (GL)</option>
              <option value="reading">Reading</option>
            </select>
          </label>
          <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Due date
            <input
              type="date"
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm normal-case text-slate-800 outline-none focus:border-blue-500"
            />
          </label>
        </div>

        <div className="mt-4">
          <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Assignment title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`e.g. ${subject === 'math' ? 'Percentages homework — Set A' : subject === 'english' ? 'Persuasive devices written response' : 'Cells and tissues quiz'}`}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm normal-case text-slate-800 outline-none focus:border-blue-500"
            />
          </label>
        </div>

        <div className="mt-4">
          <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Notes for students <span className="font-normal text-slate-400">(optional)</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Anything you want the students to read before they start."
              className="mt-1 w-full resize-none rounded-md border border-slate-300 px-3 py-2 text-sm normal-case text-slate-800 outline-none focus:border-blue-500"
            />
          </label>
        </div>

        {/* Item picker */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-black uppercase tracking-widest text-slate-600">
              Pick items ({selectedIds.size} selected)
            </p>
            {kind !== 'exam' && (
              <button
                onClick={() => {
                  if (selectedIds.size === pool.length) setSelectedIds(new Set());
                  else setSelectedIds(new Set(pool.map((p) => p.id)));
                }}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                {selectedIds.size === pool.length ? 'Deselect all' : 'Select all'}
              </button>
            )}
          </div>

          {kind === 'exam' ? (
            <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
              {glExams.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-500">No exams registered yet.</p>
              ) : (
                glExams.map((exam) => (
                  <label
                    key={exam.id}
                    className="flex cursor-pointer items-start gap-3 rounded-md border border-slate-200 bg-white p-3 hover:bg-blue-50/50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.has(exam.id)}
                      onChange={() => toggle(exam.id)}
                      className="mt-0.5 h-4 w-4"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-800">{exam.title}</p>
                      <p className="text-xs text-slate-500">
                        {exam.questions?.length ?? 0} questions ·{' '}
                        {exam.totalTime ? `${exam.totalTime} min` : 'untimed'}
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>
          ) : (
            <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
              {pool.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-500">
                  No exercises available for {subject} {unit}.
                </p>
              ) : (
                pool.map((ex) => (
                  <label
                    key={ex.id}
                    className="flex cursor-pointer items-start gap-3 rounded-md border border-slate-200 bg-white p-3 hover:bg-blue-50/50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.has(ex.id)}
                      onChange={() => toggle(ex.id)}
                      className="mt-0.5 h-4 w-4"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-800">{ex.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{ex.problem}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
          )}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={submit}
            disabled={!canCreate}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Send className="h-4 w-4" /> Post assignment
          </button>
        </div>
      </header>

      {/* Existing assignments + submissions */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900">
          <BookOpen className="h-5 w-5 text-emerald-500" /> Posted assignments ({assignments.length})
        </h3>
        {assignments.length === 0 ? (
          <p className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
            No assignments yet. Create one above.
          </p>
        ) : (
          <ul className="space-y-2">
            {assignments.map((a) => {
              const subs = listSubmissionsForAssignment(a.id);
              return (
                <li
                  key={a.id}
                  className="rounded-md border border-slate-200 bg-slate-50 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900">{a.title}</p>
                      <p className="text-[11px] text-slate-500" suppressHydrationWarning>
                        {a.subject} · {a.unit.replace('unit', 'Unit ')} · {a.kind} ·{' '}
                        {a.items.length} item{a.items.length === 1 ? '' : 's'} · due{' '}
                        {new Date(a.dueAt).toLocaleDateString()}
                      </p>
                      {a.notes && (
                        <p className="mt-1 text-xs italic text-slate-500">"{a.notes}"</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        {subs.length} submitted
                      </span>
                      <button
                        onClick={() => deleteAssignment(a.id)}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

// ── Student view ──────────────────────────────────────────────────────

function StudentView({ studentId }: { studentId: string }) {
  const all = useAssignments();
  const assignments = useMemo(
    () => all.slice().sort((a, b) => a.dueAt.localeCompare(b.dueAt)),
    [all],
  );
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <GraduationCap className="h-5 w-5 text-emerald-500" /> My Assignments
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {assignments.length === 0
                ? 'Nothing assigned yet — come back when your teacher posts a task.'
                : `You have ${assignments.length} assignment${assignments.length === 1 ? '' : 's'} to complete.`}
            </p>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
            Student
          </span>
        </div>
      </header>

      {assignments.length > 0 && (
        <ul className="space-y-3">
          {assignments.map((a) => (
            <StudentAssignmentRow
              key={a.id}
              assignment={a}
              studentId={studentId}
              expanded={openId === a.id}
              onToggle={() => setOpenId(openId === a.id ? null : a.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function StudentAssignmentRow({
  assignment,
  studentId,
  expanded,
  onToggle,
}: {
  assignment: Assignment;
  studentId: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  const existing = getSubmission(assignment.id, studentId);
  const [answers, setAnswers] = useState<Record<string, string>>(existing?.answers ?? {});

  const isOverdue = new Date(assignment.dueAt) < new Date() && !existing;
  const completionPercent = useMemo(() => {
    const filled = assignment.items.filter((it) => (answers[it.refId] || '').trim().length > 0).length;
    return Math.round((filled / Math.max(1, assignment.items.length)) * 100);
  }, [answers, assignment.items]);

  const submit = () => {
    submitAssignment({
      assignmentId: assignment.id,
      studentId,
      submittedAt: new Date().toISOString(),
      answers,
      completionPercent,
    });
    onToggle();
  };

  return (
    <li className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 p-4 text-left transition hover:bg-slate-50"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-base font-bold text-slate-900">{assignment.title}</p>
            {existing ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                <CheckCircle2 className="h-3 w-3" /> Submitted
              </span>
            ) : isOverdue ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                <AlertCircle className="h-3 w-3" /> Overdue
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700"
                suppressHydrationWarning
              >
                <Clock className="h-3 w-3" /> Due {new Date(assignment.dueAt).toLocaleDateString()}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            {assignment.subject} · {assignment.unit.replace('unit', 'Unit ')} · {assignment.kind} ·{' '}
            {assignment.items.length} item{assignment.items.length === 1 ? '' : 's'}
          </p>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50 p-4 space-y-3">
          {assignment.notes && (
            <p className="rounded-md border-l-4 border-blue-300 bg-blue-50 px-3 py-2 text-sm text-blue-900">
              {assignment.notes}
            </p>
          )}
          {assignment.items.map((it, idx) => (
            <div key={it.refId} className="rounded-md border border-slate-200 bg-white p-3">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                Question {idx + 1}
              </p>
              <p className="mb-3 text-sm text-slate-800">{it.label}</p>
              <textarea
                value={answers[it.refId] ?? ''}
                onChange={(e) =>
                  setAnswers((prev) => ({ ...prev, [it.refId]: e.target.value }))
                }
                rows={3}
                placeholder="Write your answer here…"
                className="w-full resize-none rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>
          ))}

          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">{completionPercent}% complete</p>
            </div>
            <button
              onClick={submit}
              disabled={completionPercent === 0}
              className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Send className="h-4 w-4" />
              {existing ? 'Update submission' : 'Submit'}
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

// ── Public entry ───────────────────────────────────────────────────────

export function AssignmentManager({
  mode,
  subject,
  studentId = 'demo-student',
}: {
  mode: 'teacher' | 'student';
  subject: SubjectId;
  studentId?: string;
}) {
  return mode === 'teacher' ? (
    <TeacherView initialSubject={subject} />
  ) : (
    <StudentView studentId={studentId} />
  );
}
