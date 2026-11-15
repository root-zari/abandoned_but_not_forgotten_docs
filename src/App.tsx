
import { useMemo, useState } from 'react';

import missionsData from './data/missions.json';
import type { Mission } from './types/mission';

import { FactPanel } from './components/FactPanel';
import { EvidenceDesk } from './components/EvidenceDesk';
import { OpenQuestion } from './components/OpenQuestion';
import type { OpenQuestionAnswer } from './components/OpenQuestion';
import { FutureQuestions } from './components/FutureQuestions';
import { QuestionEcho } from './components/QuestionEcho';
import { Timeline } from './components/Timeline';
import { SourceCredits } from './components/SourceCredits';

import { ModelViewer } from './components/ModelViewer';

import { collectSourcesAndCredits } from './data/collectCredits';

const missions = missionsData as Mission[];

export default function App() {
  const [selectedId, setSelectedId] = useState(missions[0].id);
  const [answers, setAnswers] = useState<OpenQuestionAnswer[]>([]);

  const selectedMission = missions.find(
    (mission) => mission.id === selectedId
  ) ?? missions[0];

  const savedAnswer = answers.find(
    (answer) => answer.missionId === selectedMission.id
  ) ?? null;

  const sourceData = useMemo(
    () => collectSourcesAndCredits(missions),
    []
  );

  function saveAnswer(answer: OpenQuestionAnswer) {
    setAnswers((previous) => [
      ...previous.filter(
        (item) => item.missionId !== answer.missionId
      ),
      answer
    ]);
  }

  const setting = selectedMission.id === 'lrv' ? 'moon' : 'mars';

  return (
    <main className="app">

      <header className="hero">
        <p className="eyebrow">NASA SPACE APPS CHALLENGE 2026 · UA VEYLORA</p>

        <h1>Abandoned but Not Forgotten</h1>

        <p className="hero-description">
          Their missions ended. Their discoveries did not.
          Explore the machines that changed planetary exploration
          and the questions they leave for the future.
        </p>

        <a className="explore-link" href="#missions">
          Explore the missions ↓
        </a>
      </header>

      <section id="missions" className="mission-section">

        <div className="section-heading">
          <p className="eyebrow">THE MISSIONS</p>
          <h2>Meet the machines</h2>
        </div>

        <nav className="mission-tabs" aria-label="Choose a mission">
          {missions.map((mission) => (
            <button
              key={mission.id}
              type="button"
              className={
                selectedId === mission.id
                  ? 'mission-tab active'
                  : 'mission-tab'
              }
              aria-pressed={selectedId === mission.id}
              onClick={() => setSelectedId(mission.id)}
            >
              {mission.name}
            </button>
          ))}
        </nav>

        <div className="mission-story">
          <p className="eyebrow">MISSION STORY</p>
          <h2>{selectedMission.name}</h2>
          <p>{selectedMission.story}</p>
        </div>

        <ModelViewer
          key={selectedMission.id}
          modelPath={selectedMission.modelPath}
          fallbackSrc={`/fallback/${selectedMission.id}.svg`}
          alt={`Interactive 3D model of ${selectedMission.name}`}
          title={selectedMission.name}
          place={selectedMission.location}
          status={selectedMission.status.value}
          hook={selectedMission.goal}
          setting={setting}
          layout="split"
        />

        <FactPanel mission={selectedMission} />

        <EvidenceDesk mission={selectedMission} />

        <OpenQuestion
          key={selectedMission.id}
          mission={selectedMission}
          initialAnswer={savedAnswer}
          onSubmit={saveAnswer}
        />

      </section>

      <Timeline
        missions={missions}
        onSelect={(id) => {
          setSelectedId(id);
          document.getElementById('missions')?.scrollIntoView({
            behavior: 'smooth'
          });
        }}
      />

      <FutureQuestions
        answers={answers}
        missions={missions}
        onRevisit={setSelectedId}
      />

      <QuestionEcho
        answers={answers}
        missions={missions.map(({ id, name }) => ({ id, name }))}
      />

      <SourceCredits
        sources={sourceData.sources}
        credits={sourceData.credits}
      />

      <footer className="footer">
        <p>ABANDONED BUT NOT FORGOTTEN</p>
        <p>Created by Team UA VEYLORA</p>
        <p>NASA Space Apps Challenge 2026</p>
      </footer>

    </main>
  );
}
