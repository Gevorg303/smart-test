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

const DisplayTestComparisonAnswers = ({id, item,view,currentAnswers,setAnswers,setActive,qsCount}) => {
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
                const find = currentAnswers.find(el => el.task.id===item.id);
                console.log(find);
                if(currentAnswers.length>0 && find != undefined && find.responseOption.length > 0){
                    const array =[];
                    find.responseOption.map((item,index)=>{array.push(item.response)})
                    setItems(array);
                } else {
                    setItems( responseOptions.map((item,index) => item.response).map(value => ({ value, sort: Math.random() }))
                        .sort((a, b) => a.sort - b.sort)
                        .map(({ value }) => value));
                }
            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        fetchAnswers();
    }, [item]);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    useEffect(() => {   //после перетаскивания объектов
        if(items.length >0){
            console.log(items)

            const array = [];
            items.map((item,index)=>{
                array.push(
                    {
                        id: responseOptions[index].id,
                        question: responseOptions[index].question,
                        response: item
                    }
                )
            })
            console.log(array)


            const find = currentAnswers.find(el => el.task.id===item.id);
            if(find != undefined) {
                currentAnswers[currentAnswers.indexOf(find)] =
                    {
                        task:{id:item.id},
                        responseOption:array
                    }
            } else{
                currentAnswers.push(
                    {
                        task:{id:item.id},
                        responseOption:array
                    }
                );
            }

            console.log(currentAnswers)
        }

    }, [items]);
    const onClickNext = () => {
        setAnswers(currentAnswers);
        setActive(prev => qsCount === prev + 1 ? prev : prev + 1);
    };

    return (
        <>
            <div className={'comparison-container'} style={{display: 'flex'}}>
                <div className={'comparison-container-question'} style={{display: 'flex', flexDirection: 'column'}}>
                    {responseOptions.map((item,index) => <p>{item.question}</p>)}
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
                        {view
                            ?
                            items.map((item,id) => <p key={id} id={id} >{item}</p>)
                            :
                            items.map((id) => <DragDropCardForComparisonAnswers key={id} id={id} />)
                        }

                    </SortableContext>
                    </DndContext>
                </div>
            </div>
            {view ? (
                <></>
            ) : (
                <Button className="answer-button" onClick={onClickNext}>Ответить</Button>
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