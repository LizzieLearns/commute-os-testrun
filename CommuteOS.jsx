import { useState, useEffect, useRef } from "react";

const FONT_URL = "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap";

const RECOMMENDATIONS = {
  walking: {
    "content-creation": {
      5: [{ title: "Voice memo idea dump", time: 5, effort: "low", outcome: "2–3 raw ideas captured", icon: "🎙" },
          { title: "Observe & describe your surroundings", time: 5, effort: "low", outcome: "1 vivid scene for content", icon: "👁" },
          { title: "Reply to 1 comment or DM", time: 5, effort: "low", outcome: "Community touch point", icon: "💬" }],
      10: [{ title: "Outline a short-form post", time: 10, effort: "medium", outcome: "1 ready-to-write draft", icon: "✏️" },
           { title: "Think through 3 content angles on a topic", time: 10, effort: "medium", outcome: "Content calendar fodder", icon: "🔀" },
           { title: "Listen to 1 creator you admire & note 1 tactic", time: 10, effort: "low", outcome: "1 actionable insight", icon: "📻" }],
      15: [{ title: "Draft a tweet thread hook + 3 points", time: 15, effort: "medium", outcome: "Thread skeleton ready", icon: "🧵" },
           { title: "Listen to podcast, pause & voice-memo takeaways", time: 15, effort: "low", outcome: "3+ ideas logged", icon: "🎧" },
           { title: "Plan next week's content calendar mentally", time: 15, effort: "medium", outcome: "Weekly plan clarity", icon: "📅" }],
      20: [{ title: "Dictate a full blog intro", time: 20, effort: "medium", outcome: "250-word draft done", icon: "📝" },
           { title: "Deep-listen to a craft-focused podcast", time: 20, effort: "low", outcome: "New creative frameworks", icon: "🎙" },
           { title: "Brainstorm 10 content ideas (shoot for quantity)", time: 20, effort: "medium", outcome: "10 ideas, 2–3 are gold", icon: "💡" }],
    },
    learning: {
      5: [{ title: "Recall yesterday's vocab from memory", time: 5, effort: "low", outcome: "Active recall boost", icon: "🧠" },
          { title: "Listen to a 5-min language lesson", time: 5, effort: "low", outcome: "1 new phrase absorbed", icon: "🌍" },
          { title: "Repeat 10 flashcards (Anki or Duolingo)", time: 5, effort: "low", outcome: "10 reps reinforced", icon: "🃏" }],
      10: [{ title: "Listen to a podcast in your target language", time: 10, effort: "low", outcome: "Immersive exposure", icon: "🎧" },
           { title: "Walk through a lesson chapter mentally", time: 10, effort: "medium", outcome: "Consolidation of concept", icon: "📖" },
           { title: "Dictate what you learned yesterday", time: 10, effort: "medium", outcome: "Retrieval practice", icon: "🗣" }],
      15: [{ title: "Audio course: one full lesson", time: 15, effort: "medium", outcome: "New skill unit complete", icon: "🎓" },
           { title: "Think through 3 'why' questions on a topic", time: 15, effort: "medium", outcome: "Deeper understanding", icon: "🔍" },
           { title: "Shadow a native speaker audio clip", time: 15, effort: "medium", outcome: "Pronunciation practice", icon: "🪞" }],
      20: [{ title: "Full podcast episode on your learning topic", time: 20, effort: "low", outcome: "New mental model", icon: "🎙" },
           { title: "Audio book chapter", time: 20, effort: "low", outcome: "Chapter complete", icon: "📚" },
           { title: "Language immersion walk — think only in target language", time: 20, effort: "medium", outcome: "Active language use", icon: "🌐" }],
    },
    "side-hustle": {
      5: [{ title: "List 3 potential clients or leads to research", time: 5, effort: "low", outcome: "Target list started", icon: "🎯" },
          { title: "Think through your offer — who is it for?", time: 5, effort: "low", outcome: "Positioning clarity", icon: "💭" },
          { title: "Voice-memo one problem your product solves", time: 5, effort: "low", outcome: "1 value prop articulated", icon: "🎙" }],
      10: [{ title: "Plan your next product feature mentally", time: 10, effort: "medium", outcome: "Feature spec roughed out", icon: "⚙️" },
           { title: "Think through your pricing strategy", time: 10, effort: "medium", outcome: "Pricing clarity", icon: "💰" },
           { title: "Draft a cold DM or outreach opening", time: 10, effort: "medium", outcome: "1 outreach message ready", icon: "📨" }],
      15: [{ title: "Voice-memo a full sales pitch or README", time: 15, effort: "medium", outcome: "Pitch draft done", icon: "📣" },
           { title: "Listen to a founder podcast & extract 1 tactic", time: 15, effort: "low", outcome: "Actionable business insight", icon: "🏗" },
           { title: "Map out your weekly side hustle milestones", time: 15, effort: "medium", outcome: "Weekly plan set", icon: "🗺" }],
      20: [{ title: "Deep-think your biggest bottleneck & 3 solutions", time: 20, effort: "medium", outcome: "Unblocking clarity", icon: "🔓" },
           { title: "Full podcast episode on your market/niche", time: 20, effort: "low", outcome: "Market insight", icon: "🎧" },
           { title: "Mentally rehearse a client or investor pitch", time: 20, effort: "medium", outcome: "Pitch confidence up", icon: "🎤" }],
    },
    relax: {
      5: [{ title: "Box breathing: 4-4-4-4 for 5 mins", time: 5, effort: "low", outcome: "Calm & reset", icon: "🌬" },
          { title: "Notice 5 things you can see, hear, feel", time: 5, effort: "low", outcome: "Grounded presence", icon: "🌿" },
          { title: "Listen to one song you love", time: 5, effort: "low", outcome: "Mood lift", icon: "🎵" }],
      10: [{ title: "Walk with no headphones — just exist", time: 10, effort: "low", outcome: "Mental declutter", icon: "🚶" },
           { title: "Guided walking meditation (audio)", time: 10, effort: "low", outcome: "Stress released", icon: "🧘" },
           { title: "Recall 3 things you're grateful for", time: 10, effort: "low", outcome: "Mindset reframe", icon: "✨" }],
      15: [{ title: "Listen to a calming playlist, focus on breath", time: 15, effort: "low", outcome: "Nervous system reset", icon: "🎼" },
           { title: "Light stretching walk (roll shoulders, neck)", time: 15, effort: "low", outcome: "Physical tension eased", icon: "💆" },
           { title: "Guided visualization audio", time: 15, effort: "low", outcome: "Refreshed mental state", icon: "☁️" }],
      20: [{ title: "Full meditation session (audio)", time: 20, effort: "low", outcome: "Deep reset achieved", icon: "🌊" },
           { title: "Slow walk, no destination — let mind wander", time: 20, effort: "low", outcome: "Creative recharge", icon: "🌳" },
           { title: "Listen to a feel-good podcast episode", time: 20, effort: "low", outcome: "Mood elevated", icon: "😊" }],
    },
  },
  subway: {
    "content-creation": {
      5: [{ title: "Write 3 hook variations for a post", time: 5, effort: "medium", outcome: "3 tested hooks", icon: "🎣" },
          { title: "Fill in your content calendar for tomorrow", time: 5, effort: "low", outcome: "Tomorrow planned", icon: "📅" },
          { title: "Swipe-file: screenshot 3 great examples", time: 5, effort: "low", outcome: "Reference bank grows", icon: "🗂" }],
      10: [{ title: "Write a complete short-form post", time: 10, effort: "medium", outcome: "Post ready to publish", icon: "✏️" },
           { title: "Edit and tighten yesterday's draft", time: 10, effort: "medium", outcome: "Polished content", icon: "✂️" },
           { title: "Read 2 newsletters and extract 1 insight each", time: 10, effort: "medium", outcome: "2 insights saved", icon: "📰" }],
      15: [{ title: "Write a full tweet thread (5–7 tweets)", time: 15, effort: "medium", outcome: "Thread ready to schedule", icon: "🧵" },
           { title: "Script a 60-second video or reel", time: 15, effort: "medium", outcome: "Video script done", icon: "🎬" },
           { title: "Research competitors and note 3 gaps", time: 15, effort: "medium", outcome: "Opportunity gaps identified", icon: "🔎" }],
      20: [{ title: "Write a full newsletter section", time: 20, effort: "medium", outcome: "Newsletter section complete", icon: "📩" },
           { title: "Plan a content series (3–5 pieces)", time: 20, effort: "medium", outcome: "Series arc mapped", icon: "📌" },
           { title: "Deep-read 1 long article, annotate insights", time: 20, effort: "medium", outcome: "Knowledge compounded", icon: "🔬" }],
    },
    learning: {
      5: [{ title: "Anki / Duolingo review session", time: 5, effort: "low", outcome: "Daily streak maintained", icon: "🃏" },
          { title: "Read 1 concept summary (Wikipedia, article)", time: 5, effort: "low", outcome: "Concept anchored", icon: "🌐" },
          { title: "Write out what you remember from last session", time: 5, effort: "medium", outcome: "Retrieval practice done", icon: "🧠" }],
      10: [{ title: "Read one chapter or lesson section", time: 10, effort: "medium", outcome: "Lesson unit complete", icon: "📖" },
           { title: "Watch a 10-min explainer video", time: 10, effort: "low", outcome: "New concept absorbed", icon: "▶️" },
           { title: "Do practice problems (math, coding, language)", time: 10, effort: "medium", outcome: "Skills applied", icon: "🏋️" }],
      15: [{ title: "Read + take structured notes", time: 15, effort: "medium", outcome: "Notes ready to review", icon: "📝" },
           { title: "Work through a tutorial step-by-step", time: 15, effort: "medium", outcome: "Tutorial progress", icon: "💻" },
           { title: "Write a 'teach it back' summary of what you know", time: 15, effort: "medium", outcome: "Deep understanding verified", icon: "✍️" }],
      20: [{ title: "Read a full article + write 3 key takeaways", time: 20, effort: "medium", outcome: "Insight extraction done", icon: "📚" },
           { title: "Complete one full online lesson with exercises", time: 20, effort: "medium", outcome: "Module complete", icon: "🎓" },
           { title: "Write a concept explanation as if teaching a friend", time: 20, effort: "medium", outcome: "Feynman technique applied", icon: "💡" }],
    },
    "side-hustle": {
      5: [{ title: "Reply to 3 potential customer tweets/posts", time: 5, effort: "low", outcome: "3 relationship touchpoints", icon: "💬" },
          { title: "Write one bullet for your landing page", time: 5, effort: "medium", outcome: "Copy improved", icon: "📌" },
          { title: "Check analytics & note 1 insight", time: 5, effort: "low", outcome: "Data-informed decision", icon: "📊" }],
      10: [{ title: "Draft a cold outreach email", time: 10, effort: "medium", outcome: "1 prospect contacted", icon: "📨" },
           { title: "Write product feature user stories", time: 10, effort: "medium", outcome: "Spec refined", icon: "🗒" },
           { title: "Research a competitor's pricing page", time: 10, effort: "low", outcome: "Positioning insight", icon: "🔍" }],
      15: [{ title: "Write a full sales page section", time: 15, effort: "medium", outcome: "Landing page progress", icon: "🏗" },
           { title: "Respond to customer feedback in detail", time: 15, effort: "medium", outcome: "Customer trust built", icon: "🤝" },
           { title: "Map out a launch checklist", time: 15, effort: "medium", outcome: "Launch plan clearer", icon: "🚀" }],
      20: [{ title: "Write a complete blog post or case study", time: 20, effort: "medium", outcome: "Long-form content done", icon: "✍️" },
           { title: "Build out a feature spec doc", time: 20, effort: "medium", outcome: "Dev-ready feature spec", icon: "⚙️" },
           { title: "Deep competitor analysis + 3 differentiators", time: 20, effort: "medium", outcome: "Strategic clarity", icon: "🎯" }],
    },
    relax: {
      5: [{ title: "Browse beautiful photography or art (offline)", time: 5, effort: "low", outcome: "Visual inspiration", icon: "🖼" },
          { title: "Journal one good thing from today", time: 5, effort: "low", outcome: "Positive anchor set", icon: "📓" },
          { title: "Doodle freely in a notes app", time: 5, effort: "low", outcome: "Creative tension released", icon: "🎨" }],
      10: [{ title: "Read fiction for pure pleasure", time: 10, effort: "low", outcome: "Mind escapes", icon: "📕" },
           { title: "Watch a short, beautiful short film or video essay", time: 10, effort: "low", outcome: "Refreshed perspective", icon: "🎞" },
           { title: "Write a stream-of-consciousness journal entry", time: 10, effort: "low", outcome: "Mental clutter cleared", icon: "🌊" }],
      15: [{ title: "Read 15 pages of a novel", time: 15, effort: "low", outcome: "Story immersion", icon: "📚" },
           { title: "Watch a documentary short", time: 15, effort: "low", outcome: "World expanded", icon: "🌍" },
           { title: "Listen to an album start to finish, eyes closed", time: 15, effort: "low", outcome: "Full mental reset", icon: "🎶" }],
      20: [{ title: "Deep-read a long essay or interview", time: 20, effort: "low", outcome: "Intellectually nourished", icon: "🗞" },
           { title: "Browse a curated inspiration source slowly", time: 20, effort: "low", outcome: "Creative battery recharged", icon: "✨" },
           { title: "Podcast: something purely entertaining", time: 20, effort: "low", outcome: "Enjoyment", icon: "😄" }],
    },
  },
  tired: {
    "content-creation": {
      5: [{ title: "Voice-memo one half-baked idea", time: 5, effort: "low", outcome: "Idea preserved", icon: "🎙" },
          { title: "Star/save 3 posts for later inspiration", time: 5, effort: "low", outcome: "Swipe file grows", icon: "⭐" },
          { title: "Note one observation from your environment", time: 5, effort: "low", outcome: "Content seed planted", icon: "🌱" }],
      10: [{ title: "Browse for inspiration (no pressure to create)", time: 10, effort: "low", outcome: "Mood board built", icon: "🖼" },
           { title: "Re-read your best old content", time: 10, effort: "low", outcome: "Remember what works", icon: "🔁" },
           { title: "Review saved ideas, star the best one", time: 10, effort: "low", outcome: "1 idea promoted", icon: "🌟" }],
      15: [{ title: "Listen to a short creative podcast passively", time: 15, effort: "low", outcome: "Passive inspiration", icon: "🎧" },
           { title: "Scroll through your niche slowly, save the best", time: 15, effort: "low", outcome: "10+ saved references", icon: "💾" },
           { title: "Free-write without editing or goal", time: 15, effort: "low", outcome: "Subconscious explored", icon: "✏️" }],
      20: [{ title: "Watch a video essay on your creative topic", time: 20, effort: "low", outcome: "Low-effort inspiration", icon: "▶️" },
           { title: "Long-read a well-crafted article", time: 20, effort: "low", outcome: "Skill modeled passively", icon: "📰" },
           { title: "Nap mentally: close eyes, no phone, just think", time: 20, effort: "low", outcome: "Subconscious processing", icon: "💤" }],
    },
    learning: {
      5: [{ title: "Review a concept summary card", time: 5, effort: "low", outcome: "Light exposure maintained", icon: "👀" },
          { title: "Watch a 5-min explainer video", time: 5, effort: "low", outcome: "Passive concept review", icon: "▶️" },
          { title: "Re-read notes from a past session", time: 5, effort: "low", outcome: "Memory reinforced", icon: "📋" }],
      10: [{ title: "Light flashcard review (easy cards only)", time: 10, effort: "low", outcome: "Streak maintained", icon: "🃏" },
           { title: "Watch an engaging documentary clip", time: 10, effort: "low", outcome: "Passive learning", icon: "🎬" },
           { title: "Listen to a simple explainer podcast", time: 10, effort: "low", outcome: "New frame absorbed", icon: "🎧" }],
      15: [{ title: "Audiobook on a topic you enjoy", time: 15, effort: "low", outcome: "Chapter progress", icon: "🎙" },
           { title: "Rewatch a lesson you found confusing", time: 15, effort: "low", outcome: "Clarity improves", icon: "🔄" },
           { title: "Slow read, no notes — just absorb", time: 15, effort: "low", outcome: "Passive immersion", icon: "📖" }],
      20: [{ title: "Watch a full 20-min lecture on something new", time: 20, effort: "low", outcome: "New domain exposure", icon: "🏫" },
           { title: "Podcast on your learning topic (easy listen)", time: 20, effort: "low", outcome: "Background learning", icon: "🎧" },
           { title: "Reread a chapter you enjoyed", time: 20, effort: "low", outcome: "Review without pressure", icon: "📚" }],
    },
    "side-hustle": {
      5: [{ title: "Read 3 testimonials or reviews of competitors", time: 5, effort: "low", outcome: "Customer language noted", icon: "👥" },
          { title: "Write one 'why I'm building this' sentence", time: 5, effort: "low", outcome: "Motivation refreshed", icon: "❤️" },
          { title: "Browse product hunt for adjacent ideas", time: 5, effort: "low", outcome: "Market awareness", icon: "🔭" }],
      10: [{ title: "Light research on your target customer", time: 10, effort: "low", outcome: "Empathy deepened", icon: "🔍" },
           { title: "Read a founder's thread on a lesson learned", time: 10, effort: "low", outcome: "Vicarious experience", icon: "💼" },
           { title: "Review your metrics / numbers calmly", time: 10, effort: "low", outcome: "Data awareness", icon: "📊" }],
      15: [{ title: "Listen to a founder podcast (easy topic)", time: 15, effort: "low", outcome: "Mindset maintained", icon: "🎙" },
           { title: "Casually browse your niche community", time: 15, effort: "low", outcome: "Community pulse", icon: "👋" },
           { title: "Review your roadmap without pressure", time: 15, effort: "low", outcome: "Big picture reminder", icon: "🗺" }],
      20: [{ title: "Watch a 'day in the life' founder video", time: 20, effort: "low", outcome: "Motivation renewed", icon: "🌅" },
           { title: "Read a business biography chapter", time: 20, effort: "low", outcome: "Wisdom absorbed passively", icon: "📘" },
           { title: "Listen to your favourite entrepreneur podcast ep", time: 20, effort: "low", outcome: "Energy replenished", icon: "⚡" }],
    },
    relax: {
      5: [{ title: "4-7-8 breathing: breathe in 4, hold 7, out 8", time: 5, effort: "low", outcome: "Nervous system calmed", icon: "🌬" },
          { title: "Eyes closed, no phone — just rest", time: 5, effort: "low", outcome: "Micro rest taken", icon: "😴" },
          { title: "Think of 3 small things that went well today", time: 5, effort: "low", outcome: "Mood stabilized", icon: "🙏" }],
      10: [{ title: "Rest with calming music or nature sounds", time: 10, effort: "low", outcome: "Energy partially recovered", icon: "🎵" },
           { title: "Eyes closed, guided body scan audio", time: 10, effort: "low", outcome: "Tension located & released", icon: "🧘" },
           { title: "Watch something slow and beautiful (no audio needed)", time: 10, effort: "low", outcome: "Quiet joy", icon: "🌸" }],
      15: [{ title: "Doze or micro-nap if possible", time: 15, effort: "low", outcome: "Energy partially restored", icon: "💤" },
           { title: "Guided meditation or NSDR protocol (audio)", time: 15, effort: "low", outcome: "Non-sleep deep rest achieved", icon: "🌊" },
           { title: "Nature sounds + no screen, just breathe", time: 15, effort: "low", outcome: "Parasympathetic reset", icon: "🍃" }],
      20: [{ title: "20-min NSDR / Yoga Nidra audio", time: 20, effort: "low", outcome: "Deep recovery in transit", icon: "🌙" },
           { title: "Rest eyes, listen to ambient music only", time: 20, effort: "low", outcome: "Mental fatigue reduced", icon: "☁️" },
           { title: "Sleep if safe to do so", time: 20, effort: "low", outcome: "Rest taken", icon: "😴" }],
    },
  },
};

const CONTEXT_LABELS = { walking: "Walking", subway: "Subway / Bus", tired: "Low Energy" };
const GOAL_LABELS = { "content-creation": "Content Creation", learning: "Learning", "side-hustle": "Side Hustle", relax: "Relax / Recover" };
const GOAL_COLORS = { "content-creation": "#F0A500", learning: "#4ECDC4", "side-hustle": "#A78BFA", relax: "#68D391" };
const EFFORT_COLORS = { low: "#68D391", medium: "#F0A500" };

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: "⚡" },
  { id: "ideas", label: "Ideas", icon: "💡" },
  { id: "routines", label: "Routines", icon: "🗂" },
  { id: "stats", label: "Stats", icon: "📊" },
];

const DEFAULT_ROUTINES = [
  { id: "r1", name: "Morning Rush", steps: [{ context: "walking", goal: "relax", time: 5, label: "Walk to station — breathe" }, { context: "subway", goal: "learning", time: 20, label: "Learn on the subway" }] },
  { id: "r2", name: "Creative Flow", steps: [{ context: "walking", goal: "content-creation", time: 10, label: "Idea capture walk" }, { context: "subway", goal: "content-creation", time: 15, label: "Write on subway" }] },
];

function useStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; } catch { return initial; }
  });
  const set = (v) => { setVal(v); try { localStorage.setItem(key, JSON.stringify(v)); } catch {} };
  return [val, set];
}

export default function CommuteOS() {
  const [view, setView] = useState("home");
  const [time, setTime] = useState(null);
  const [context, setContext] = useState(null);
  const [goal, setGoal] = useState(null);
  const [showRecs, setShowRecs] = useState(false);
  const [ideas, setIdeas] = useStorage("cos_ideas", []);
  const [routines, setRoutines] = useStorage("cos_routines", DEFAULT_ROUTINES);
  const [stats, setStats] = useStorage("cos_stats", { totalMins: 0, ideasCount: 0, streak: 1, lastUsed: null, sessions: [] });
  const [ideaText, setIdeaText] = useState("");
  const [ideaTag, setIdeaTag] = useState("content");
  const [newRoutineName, setNewRoutineName] = useState("");
  const [addingIdea, setAddingIdea] = useState(false);
  const [completedTask, setCompletedTask] = useState(null);
  const ideaRef = useRef(null);

  useEffect(() => {
    if (addingIdea && ideaRef.current) ideaRef.current.focus();
  }, [addingIdea]);

  const getRecs = () => {
    if (!context || !goal || !time) return [];
    return RECOMMENDATIONS[context]?.[goal]?.[time] || [];
  };

  const handleGetSuggestions = () => {
    if (time && context && goal) setShowRecs(true);
  };

  const handleReset = () => { setShowRecs(false); setTime(null); setContext(null); setGoal(null); setCompletedTask(null); };

  const handleComplete = (task) => {
    setCompletedTask(task);
    const today = new Date().toDateString();
    const last = stats.lastUsed;
    const newStreak = last === new Date(Date.now() - 86400000).toDateString() ? stats.streak + 1 : last === today ? stats.streak : 1;
    setStats({ ...stats, totalMins: stats.totalMins + task.time, sessions: [...stats.sessions, { date: today, task: task.title, mins: task.time }], lastUsed: today, streak: newStreak });
  };

  const saveIdea = () => {
    if (!ideaText.trim()) return;
    const newIdea = { id: Date.now(), text: ideaText, tag: ideaTag, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }) };
    const updated = [newIdea, ...ideas];
    setIdeas(updated);
    setStats({ ...stats, ideasCount: stats.ideasCount + 1 });
    setIdeaText(""); setAddingIdea(false);
  };

  const deleteIdea = (id) => setIdeas(ideas.filter(i => i.id !== id));

  const addRoutine = () => {
    if (!newRoutineName.trim()) return;
    const r = { id: Date.now().toString(), name: newRoutineName, steps: [{ context: "walking", goal: "relax", time: 5, label: "Custom step" }] };
    setRoutines([...routines, r]);
    setNewRoutineName("");
  };

  const loadRoutine = (r) => {
    if (r.steps.length > 0) { const s = r.steps[0]; setContext(s.context); setGoal(s.goal); setTime(s.time); setView("home"); setShowRecs(false); }
  };

  const recs = getRecs();
  const tagColors = { content: "#F0A500", life: "#4ECDC4", learning: "#A78BFA" };

  return (
    <>
      <style>{`
        @import url('${FONT_URL}');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0A0A0B; }
        .cos { font-family: 'DM Sans', sans-serif; background: #0A0A0B; color: #F0EFEC; min-height: 100vh; max-width: 430px; margin: 0 auto; display: flex; flex-direction: column; position: relative; }
        .syne { font-family: 'Syne', sans-serif; }
        .screen { flex: 1; padding: 24px 20px 100px; overflow-y: auto; }
        .logo { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.18em; color: #F0A500; text-transform: uppercase; margin-bottom: 28px; display: flex; align-items: center; gap: 8px; }
        .logo-dot { width: 6px; height: 6px; background: #F0A500; border-radius: 50%; }
        .section-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; color: #F0EFEC; line-height: 1.2; margin-bottom: 6px; }
        .section-sub { font-size: 13px; color: #6B6B6E; margin-bottom: 24px; }
        .chip-group { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
        .chip { padding: 8px 16px; border-radius: 100px; border: 1px solid #2A2A2C; background: #141415; color: #9A9A9E; font-size: 13px; font-weight: 400; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
        .chip:active { transform: scale(0.97); }
        .chip.selected { border-color: #F0A500; background: rgba(240,165,0,0.1); color: #F0A500; font-weight: 500; }
        .chip.context.selected { border-color: #4ECDC4; background: rgba(78,205,196,0.1); color: #4ECDC4; }
        .label { font-size: 11px; font-weight: 500; letter-spacing: 0.1em; color: #4B4B4E; text-transform: uppercase; margin-bottom: 10px; }
        .cta-btn { width: 100%; padding: 16px; border-radius: 14px; background: #F0A500; border: none; color: #0A0A0B; font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.15s; letter-spacing: 0.02em; margin-top: 8px; }
        .cta-btn:active { transform: scale(0.98); background: #D4920A; }
        .cta-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .cta-btn.ghost { background: transparent; border: 1px solid #2A2A2C; color: #6B6B6E; font-size: 13px; padding: 12px; }
        .cta-btn.ghost:active { background: #141415; }
        .rec-card { background: #141415; border: 1px solid #1E1E20; border-radius: 16px; padding: 18px; margin-bottom: 12px; position: relative; overflow: hidden; }
        .rec-card::before { content: ''; position: absolute; top: 0; left: 0; width: 3px; height: 100%; background: #F0A500; border-radius: 3px 0 0 3px; }
        .rec-icon { font-size: 22px; margin-bottom: 10px; display: block; }
        .rec-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 600; color: #F0EFEC; margin-bottom: 8px; line-height: 1.3; }
        .rec-meta { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }
        .badge { font-size: 11px; padding: 3px 9px; border-radius: 100px; font-weight: 500; }
        .badge.time { background: rgba(240,165,0,0.12); color: #F0A500; border: 1px solid rgba(240,165,0,0.25); }
        .badge.effort-low { background: rgba(104,211,145,0.12); color: #68D391; border: 1px solid rgba(104,211,145,0.25); }
        .badge.effort-medium { background: rgba(240,165,0,0.12); color: #F0A500; border: 1px solid rgba(240,165,0,0.25); }
        .rec-outcome { font-size: 12px; color: #5A5A5E; line-height: 1.4; }
        .rec-outcome span { color: #7A7A7E; }
        .done-btn { width: 100%; padding: 13px; border-radius: 100px; background: transparent; border: 1px solid #2A2A2C; color: #6B6B6E; font-size: 13px; cursor: pointer; margin-top: 4px; transition: all 0.15s; }
        .done-btn:active { background: rgba(104,211,145,0.1); border-color: #68D391; color: #68D391; }
        .done-card { background: rgba(104,211,145,0.08); border: 1px solid rgba(104,211,145,0.25); border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 16px; }
        .done-card .big { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; color: #68D391; }
        .done-card .sub { font-size: 13px; color: #5A5A5E; margin-top: 4px; }
        .nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; background: rgba(10,10,11,0.95); border-top: 1px solid #1A1A1C; display: flex; padding: 10px 0 20px; backdrop-filter: blur(12px); z-index: 100; }
        .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; padding: 4px 0; }
        .nav-icon { font-size: 18px; line-height: 1; }
        .nav-label { font-size: 10px; color: #3B3B3E; font-weight: 500; letter-spacing: 0.05em; transition: color 0.15s; }
        .nav-item.active .nav-label { color: #F0A500; }
        .idea-input-row { display: flex; gap: 10px; margin-bottom: 16px; align-items: flex-start; }
        .idea-textarea { flex: 1; background: #141415; border: 1px solid #1E1E20; border-radius: 12px; color: #F0EFEC; font-size: 14px; font-family: 'DM Sans', sans-serif; padding: 12px 14px; resize: none; outline: none; min-height: 48px; max-height: 120px; transition: border-color 0.15s; }
        .idea-textarea:focus { border-color: #2E2E32; }
        .idea-textarea::placeholder { color: #3B3B3E; }
        .tag-pills { display: flex; gap: 6px; margin-bottom: 12px; }
        .tag-pill { padding: 5px 12px; border-radius: 100px; font-size: 12px; font-weight: 500; cursor: pointer; border: 1px solid transparent; transition: all 0.15s; }
        .idea-item { background: #141415; border: 1px solid #1E1E20; border-radius: 14px; padding: 14px 16px; margin-bottom: 8px; display: flex; align-items: flex-start; gap: 12px; }
        .idea-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
        .idea-text { flex: 1; font-size: 14px; color: #D0D0CE; line-height: 1.5; }
        .idea-footer { font-size: 11px; color: #3B3B3E; margin-top: 4px; }
        .idea-del { font-size: 16px; color: #2A2A2C; cursor: pointer; flex-shrink: 0; padding: 2px; }
        .idea-del:active { color: #E24B4A; }
        .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
        .stat-card { background: #141415; border: 1px solid #1E1E20; border-radius: 14px; padding: 16px; }
        .stat-val { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; color: #F0EFEC; }
        .stat-label { font-size: 12px; color: #4B4B4E; margin-top: 4px; }
        .routine-card { background: #141415; border: 1px solid #1E1E20; border-radius: 14px; padding: 16px; margin-bottom: 10px; }
        .routine-name { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 600; color: #F0EFEC; margin-bottom: 10px; }
        .routine-step { display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid #1A1A1C; }
        .routine-step:last-child { border-bottom: none; }
        .routine-step-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .routine-step-text { font-size: 13px; color: #8A8A8E; flex: 1; }
        .routine-step-time { font-size: 11px; color: #4B4B4E; }
        .load-btn { background: transparent; border: 1px solid #2A2A2C; border-radius: 8px; color: #6B6B6E; font-size: 12px; padding: 6px 14px; cursor: pointer; margin-top: 10px; width: 100%; }
        .load-btn:active { background: rgba(240,165,0,0.08); border-color: rgba(240,165,0,0.3); color: #F0A500; }
        .add-row { display: flex; gap: 8px; margin-top: 16px; }
        .text-input { flex: 1; background: #141415; border: 1px solid #1E1E20; border-radius: 10px; color: #F0EFEC; font-size: 14px; font-family: 'DM Sans', sans-serif; padding: 10px 12px; outline: none; }
        .text-input:focus { border-color: #2E2E32; }
        .text-input::placeholder { color: #3B3B3E; }
        .add-btn { background: #F0A500; border: none; border-radius: 10px; color: #0A0A0B; font-size: 14px; font-weight: 600; padding: 10px 16px; cursor: pointer; white-space: nowrap; }
        .empty-state { text-align: center; padding: 40px 20px; }
        .empty-icon { font-size: 32px; margin-bottom: 12px; }
        .empty-text { font-size: 14px; color: #4B4B4E; line-height: 1.5; }
        .pill-add { width: 40px; height: 40px; border-radius: 50%; background: #F0A500; border: none; color: #0A0A0B; font-size: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .divider { height: 1px; background: #1A1A1C; margin: 20px 0; }
        .streak-bar { background: linear-gradient(90deg, rgba(240,165,0,0.15) 0%, rgba(240,165,0,0.05) 100%); border: 1px solid rgba(240,165,0,0.2); border-radius: 14px; padding: 16px; margin-bottom: 20px; display: flex; align-items: center; gap: 14px; }
        .streak-num { font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 800; color: #F0A500; }
        .streak-text { }
        .streak-title { font-size: 14px; font-weight: 500; color: #D0D0CE; }
        .streak-sub { font-size: 12px; color: #5A5A5E; margin-top: 2px; }
        .session-list { }
        .session-item { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid #141415; }
        .session-dot { width: 6px; height: 6px; border-radius: 50%; background: #F0A500; flex-shrink: 0; }
        .session-text { flex: 1; font-size: 13px; color: #8A8A8E; }
        .session-time { font-size: 12px; color: #4B4B4E; }
        .back-btn { background: none; border: none; color: #6B6B6E; font-size: 13px; cursor: pointer; margin-bottom: 20px; display: flex; align-items: center; gap: 6px; padding: 0; }
        .step-indicator { display: flex; gap: 6px; margin-bottom: 28px; }
        .step-dot { height: 3px; border-radius: 2px; transition: all 0.2s; }
        .goal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px; }
        .goal-card { background: #141415; border: 1px solid #1E1E20; border-radius: 14px; padding: 16px 14px; cursor: pointer; transition: all 0.15s; }
        .goal-card:active { transform: scale(0.97); }
        .goal-card.selected { border-color: rgba(240,165,0,0.4); background: rgba(240,165,0,0.06); }
        .goal-card-icon { font-size: 20px; margin-bottom: 8px; }
        .goal-card-name { font-size: 13px; font-weight: 500; color: #9A9A9E; }
        .goal-card.selected .goal-card-name { color: #F0A500; }
      `}</style>

      <div className="cos">
        <div className="screen">

          {view === "home" && !showRecs && (
            <>
              <div className="logo"><div className="logo-dot" />Commute OS</div>
              <div className="section-title">What's your situation?</div>
              <div className="section-sub">Takes 3 seconds. Gets you moving.</div>

              <div className="step-indicator">
                {[!!time, !!context, !!goal].map((done, i) => (
                  <div key={i} className="step-dot" style={{ flex: 1, background: done ? "#F0A500" : "#1E1E20" }} />
                ))}
              </div>

              <div className="label">Time available</div>
              <div className="chip-group">
                {[5, 10, 15, 20].map(t => (
                  <div key={t} className={`chip${time === t ? " selected" : ""}`} onClick={() => setTime(t)}>{t} min</div>
                ))}
              </div>

              <div className="label">Context</div>
              <div className="chip-group">
                {Object.entries(CONTEXT_LABELS).map(([k, v]) => (
                  <div key={k} className={`chip context${context === k ? " selected" : ""}`} onClick={() => setContext(k)}>{v}</div>
                ))}
              </div>

              <div className="label">Goal</div>
              <div className="goal-grid">
                {Object.entries(GOAL_LABELS).map(([k, v]) => {
                  const icons = { "content-creation": "✏️", learning: "🎓", "side-hustle": "🚀", relax: "🌿" };
                  return (
                    <div key={k} className={`goal-card${goal === k ? " selected" : ""}`} onClick={() => setGoal(k)}>
                      <div className="goal-card-icon">{icons[k]}</div>
                      <div className="goal-card-name">{v}</div>
                    </div>
                  );
                })}
              </div>

              <button className="cta-btn" disabled={!time || !context || !goal} onClick={handleGetSuggestions}>
                Get Suggestions →
              </button>
            </>
          )}

          {view === "home" && showRecs && !completedTask && (
            <>
              <button className="back-btn" onClick={handleReset}>← Back</button>
              <div className="logo"><div className="logo-dot" />Commute OS</div>
              <div className="section-title">Suggested for you</div>
              <div className="section-sub">
                {time} min · {CONTEXT_LABELS[context]} · {GOAL_LABELS[goal]}
              </div>
              {recs.map((r, i) => (
                <div className="rec-card" key={i}>
                  <span className="rec-icon">{r.icon}</span>
                  <div className="rec-title">{r.title}</div>
                  <div className="rec-meta">
                    <span className="badge time">{r.time} min</span>
                    <span className={`badge effort-${r.effort}`}>{r.effort} effort</span>
                  </div>
                  <div className="rec-outcome">Expected: <span>{r.outcome}</span></div>
                  <button className="done-btn" onClick={() => handleComplete(r)}>✓ Done</button>
                </div>
              ))}
              <button className="cta-btn ghost" onClick={handleReset}>Start over</button>
            </>
          )}

          {view === "home" && showRecs && completedTask && (
            <>
              <div className="logo"><div className="logo-dot" />Commute OS</div>
              <div className="done-card">
                <div className="big">+{completedTask.time}m</div>
                <div className="sub">"{completedTask.title}"</div>
              </div>
              <div className="stat-grid">
                <div className="stat-card">
                  <div className="stat-val">{stats.totalMins}</div>
                  <div className="stat-label">Total mins earned</div>
                </div>
                <div className="stat-card">
                  <div className="stat-val">{stats.streak}</div>
                  <div className="stat-label">Day streak 🔥</div>
                </div>
              </div>
              <button className="cta-btn" onClick={() => { setView("ideas"); setShowRecs(false); setCompletedTask(null); setAddingIdea(true); }}>Capture an idea 💡</button>
              <button className="cta-btn ghost" style={{ marginTop: 8 }} onClick={handleReset}>New session</button>
            </>
          )}

          {view === "ideas" && (
            <>
              <div className="logo"><div className="logo-dot" />Commute OS</div>
              <div className="section-title">Idea Capture</div>
              <div className="section-sub">One tap to save what crosses your mind.</div>

              {addingIdea ? (
                <>
                  <div className="tag-pills">
                    {Object.entries({ content: "Content", life: "Life", learning: "Learning" }).map(([k, v]) => (
                      <div key={k} className="tag-pill" onClick={() => setIdeaTag(k)}
                        style={{ background: ideaTag === k ? `${tagColors[k]}20` : "#141415", color: ideaTag === k ? tagColors[k] : "#5A5A5E", border: `1px solid ${ideaTag === k ? tagColors[k] + "40" : "#1E1E20"}` }}
                      >{v}</div>
                    ))}
                  </div>
                  <div className="idea-input-row">
                    <textarea ref={ideaRef} className="idea-textarea" rows={2} placeholder="What's the idea?" value={ideaText} onChange={e => setIdeaText(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); saveIdea(); } }}
                    />
                    <button className="pill-add" onClick={saveIdea}>+</button>
                  </div>
                  <button className="cta-btn ghost" onClick={() => { setAddingIdea(false); setIdeaText(""); }}>Cancel</button>
                  <div className="divider" />
                </>
              ) : (
                <button className="cta-btn" onClick={() => setAddingIdea(true)} style={{ marginBottom: 20 }}>+ New idea</button>
              )}

              {ideas.length === 0 && !addingIdea && (
                <div className="empty-state">
                  <div className="empty-icon">💡</div>
                  <div className="empty-text">Your ideas will appear here.<br />Capture them before they disappear.</div>
                </div>
              )}

              {ideas.map(idea => (
                <div className="idea-item" key={idea.id}>
                  <div className="idea-dot" style={{ background: tagColors[idea.tag] || "#4B4B4E" }} />
                  <div style={{ flex: 1 }}>
                    <div className="idea-text">{idea.text}</div>
                    <div className="idea-footer">{idea.tag} · {idea.date}</div>
                  </div>
                  <div className="idea-del" onClick={() => deleteIdea(idea.id)}>×</div>
                </div>
              ))}
            </>
          )}

          {view === "routines" && (
            <>
              <div className="logo"><div className="logo-dot" />Commute OS</div>
              <div className="section-title">Your Routines</div>
              <div className="section-sub">Saved commute sequences, one tap to load.</div>

              {routines.map(r => (
                <div className="routine-card" key={r.id}>
                  <div className="routine-name">{r.name}</div>
                  {r.steps.map((s, i) => (
                    <div className="routine-step" key={i}>
                      <div className="routine-step-dot" style={{ background: GOAL_COLORS[s.goal] || "#4B4B4E" }} />
                      <div className="routine-step-text">{s.label || `${CONTEXT_LABELS[s.context]} → ${GOAL_LABELS[s.goal]}`}</div>
                      <div className="routine-step-time">{s.time}m</div>
                    </div>
                  ))}
                  <button className="load-btn" onClick={() => loadRoutine(r)}>Load this routine →</button>
                </div>
              ))}

              <div className="add-row">
                <input className="text-input" placeholder="New routine name…" value={newRoutineName} onChange={e => setNewRoutineName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addRoutine()} />
                <button className="add-btn" onClick={addRoutine}>Add</button>
              </div>
            </>
          )}

          {view === "stats" && (
            <>
              <div className="logo"><div className="logo-dot" />Commute OS</div>
              <div className="section-title">Your Progress</div>
              <div className="section-sub">Every minute reclaimed compounds.</div>

              <div className="streak-bar">
                <div className="streak-num">{stats.streak}</div>
                <div className="streak-text">
                  <div className="streak-title">Day streak 🔥</div>
                  <div className="streak-sub">Keep showing up</div>
                </div>
              </div>

              <div className="stat-grid">
                <div className="stat-card">
                  <div className="stat-val" style={{ color: "#F0A500" }}>{stats.totalMins}</div>
                  <div className="stat-label">Minutes earned</div>
                </div>
                <div className="stat-card">
                  <div className="stat-val" style={{ color: "#4ECDC4" }}>{ideas.length}</div>
                  <div className="stat-label">Ideas captured</div>
                </div>
                <div className="stat-card">
                  <div className="stat-val" style={{ color: "#A78BFA" }}>{stats.sessions.length}</div>
                  <div className="stat-label">Sessions done</div>
                </div>
                <div className="stat-card">
                  <div className="stat-val" style={{ color: "#68D391" }}>{stats.sessions.length > 0 ? Math.round(stats.totalMins / stats.sessions.length) : 0}</div>
                  <div className="stat-label">Avg mins/session</div>
                </div>
              </div>

              {stats.sessions.length > 0 && (
                <>
                  <div className="label">Recent sessions</div>
                  <div className="session-list">
                    {[...stats.sessions].reverse().slice(0, 8).map((s, i) => (
                      <div className="session-item" key={i}>
                        <div className="session-dot" />
                        <div className="session-text">{s.task}</div>
                        <div className="session-time">{s.mins}m · {s.date}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {stats.sessions.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">📊</div>
                  <div className="empty-text">Complete a session to start tracking your progress.</div>
                </div>
              )}
            </>
          )}
        </div>

        <nav className="nav">
          {NAV_ITEMS.map(item => (
            <div key={item.id} className={`nav-item${view === item.id ? " active" : ""}`} onClick={() => { setView(item.id); if (item.id === "home") { setShowRecs(false); setCompletedTask(null); } }}>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
