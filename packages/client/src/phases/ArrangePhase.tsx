import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useGameStore } from '../store/gameStore.js';
import { EVENTS } from '../events.js';
import { BattleCard } from '../components/BattleCard.js';
import type { CardState } from '@tag-battle/shared';

interface ArrangePhaseProps {
  emit: (event: string, data: unknown) => void;
}

function SortableCardRow({ card, index }: { card: CardState; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        display:'flex', alignItems:'center', gap:10,
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.35 : 1,
      }}
    >
      <span style={{ width:20, textAlign:'right', color:'var(--silver)', fontSize:'.85rem' }}>
        {index + 1}
      </span>
      <div
        {...attributes}
        {...listeners}
        style={{
          cursor: 'grab',
          padding:'4px 8px',
          color:'var(--border-hi)',
          fontSize:'1.1rem',
          userSelect:'none',
          touchAction:'none',
        }}
        title="ドラッグして並び替え"
      >
        ⠿
      </div>
      <BattleCard card={card} />
      <div style={{ fontSize:'.72rem', color:'var(--silver)', maxWidth:200 }}>
        {card.description}
      </div>
    </div>
  );
}

export function ArrangePhase({ emit }: ArrangePhaseProps) {
  const { myDeck, setOrderedDeck } = useGameStore();
  const [orderedDeck, setLocalOrderedDeck] = useState<CardState[]>([...myDeck]);
  const [activeCard, setActiveCard]   = useState<CardState | null>(null);
  const [submitted, setSubmitted]     = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragStart = (e: DragStartEvent) => {
    const card = orderedDeck.find(c => c.id === e.active.id);
    setActiveCard(card ?? null);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveCard(null);
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = orderedDeck.findIndex(c => c.id === active.id);
    const newIdx = orderedDeck.findIndex(c => c.id === over.id);
    const next   = arrayMove(orderedDeck, oldIdx, newIdx);
    setLocalOrderedDeck(next);
    setOrderedDeck(next);
  };

  const handleSubmit = () => {
    emit(EVENTS.ARRANGE_SUBMIT, { deckOrder: orderedDeck.map(c => c.id) });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="center" style={{ minHeight:'100vh', flexDirection:'column', gap:16 }}>
        <div className="spinner" />
        <div style={{ color:'var(--silver)' }}>送信完了！対戦相手を待っています...</div>
      </div>
    );
  }

  return (
    <div className="page" style={{ maxWidth:700, margin:'0 auto', alignItems:'flex-start' }}>
      <div className="phase-header" style={{ maxWidth:'100%' }}>
        <div>
          <div className="phase-title">③ 並び替えフェーズ</div>
          <div className="phase-sub">ドラッグして8枚のデッキ順を決定（上から順に使用）</div>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={orderedDeck.map(c => c.id)} strategy={verticalListSortingStrategy}>
          <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:6 }}>
            {orderedDeck.map((card, i) => (
              <SortableCardRow key={card.id} card={card} index={i} />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeCard && (
            <div style={{ transform:'rotate(2deg)', opacity:.9 }}>
              <BattleCard card={activeCard} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <button className="btn btn-primary" onClick={handleSubmit} style={{ marginTop:8 }}>
        この順番で決定する
      </button>
    </div>
  );
}
