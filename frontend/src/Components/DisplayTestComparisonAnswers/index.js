import React,{useState,useEffect} from 'react';
import { Form, Button } from 'react-bootstrap';
import './styles.css';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import {DragDropCardForComparisonAnswers} from "../DragDropCardForComparisonAnswers";

const DisplayTestComparisonAnswers = ({item,view}) => {
    //const [items, setItems] = useState([1, 2, 3]);
    const [items, setItems] = useState([]);
    const [responseOptions,setResponseOptions] = useState([]);

    useEffect(() => {
        async function fetchAnswers() {
            try {

                const response = await fetch('http://localhost:8080/response-option/find-response-option-by-task', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify({id:item.id})
                });
                const responseOptions = await response.json();
                console.log(responseOptions)
              //  setItems(responseOptions)
                setResponseOptions(responseOptions)
                setItems( responseOptions.map((item,index) => index+" "+item.response));

            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        fetchAnswers();
    }, []);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <>
            <div className={'comparison-container'} style={{display: 'flex'}}>
                <div className={'comparison-container-question'} style={{display: 'flex', flexDirection: 'column'}}>
                    {responseOptions.map((item,index) => <p>{index+" "+item.question}</p>)}
                </div>
                <div className={'comparison-container-response'} style={{display: 'flex', flexDirection: 'column'}}>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                    <SortableContext
                        items={items}
                        strategy={verticalListSortingStrategy}
                    >
                        {items.map(id => <DragDropCardForComparisonAnswers key={id} id={id} />)}
                    </SortableContext>
                    </DndContext>
                </div>
            </div>
            {view ? (
                <></>
            ) : (
                <Button className="answer-button" onClick={() => {/*onClick(id, currentAnswers[id])}*/}}>Ответить</Button>
            )}
        </>

    );

    function handleDragEnd(event) {
        const {active, over} = event;

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }
};

export default DisplayTestComparisonAnswers;