import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import './styles.css';

export function DragDropCardForComparisonAnswers(props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: props.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div onCopy={e => e.preventDefault()} className="drag-drop-card" ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {props.id}
        </div>
    );
}