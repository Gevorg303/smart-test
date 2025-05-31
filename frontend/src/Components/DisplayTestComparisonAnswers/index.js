import React,{useState,useEffect} from 'react';
import { Form, Button,Badge,Stack } from 'react-bootstrap';
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

const DisplayTestComparisonAnswers = ({id, item,view,currentAnswers,answers,setAnswers,setActive,qsCount}) => {
    //const [items, setItems] = useState([1, 2, 3]);
    const [items, setItems] = useState([]);
    const [responseOptions,setResponseOptions] = useState([]);

    useEffect(() => {
        async function fetchAnswers() {
            try {

                if(!view){
                    const response = await fetch(process.env.REACT_APP_SERVER_URL+'response-option/find-response-option-by-task', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify({id:item.id})
                    });
                    const responseOptions = await response.json();
                    console.log(responseOptions)
                    setResponseOptions(responseOptions)
                } else {
                    const find = answers.find(el => el.task.id===item.id);
                    console.log(find)
                    setResponseOptions(find.responseOption)
                }

              //  setItems(responseOptions)

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
    useEffect(() => {
        async function fetchAnswers() {
            try {

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
    }, [item,responseOptions]);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    useEffect(() => {   //после перетаскивания объектов
        if(!view){
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
        }

        console.log(answers)
        console.log(responseOptions)
    }, [items]);
    const onClickNext = () => {
        console.log(answers)
        setAnswers(currentAnswers);
        setActive(prev => qsCount === prev + 1 ? prev : prev + 1);
    };

    return (
        <>
            <Stack direction="horizontal" className={'comparison-container'} gap={1}>
                {/*<div className={'comparison-container'} style={{display: 'flex'}}>*/}
                <Stack direction="vertical"className={'comparison-container-question'} style={{display: 'flex', flexDirection: 'column'}} gap={1}>
                    {/* <div className={'comparison-container-question'} style={{display: 'flex', flexDirection: 'column'}}>*/}
                    {view
                        ?
                        responseOptions.map((item,index) => <Stack direction="horizontal" gap={1}>
                            <p onCopy={e => e.preventDefault()} className={"response-option-badge"}> {item.question}</p>
                        </Stack>)

                        :
                        responseOptions.map((item,index) => <p onCopy={e => e.preventDefault()} > {item.question}</p>)
                    }
                </Stack>
                    { /*</div>

                <div className={'comparison-container-response'} style={{display: 'flex', flexDirection: 'column'}}>*/}
                <div  className={'comparison-container-response'} style={{display: 'flex', flexDirection: 'column'}} >
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                    <SortableContext
                        items={items}
                        strategy={verticalListSortingStrategy}
                        handle
                    >
                        {view
                            ?
                            items.map((item,id) =>  <DragDropCardForComparisonAnswers onCopy={e => e.preventDefault()} className="drag-drop-card-view" key={id} id={id} text={item} view={view} ></DragDropCardForComparisonAnswers>)
                            :
                            items.map((id) => <DragDropCardForComparisonAnswers key={id} id={id} text={id} view={view}/>)
                        }

                    </SortableContext>
                    </DndContext>
                </div>
                {/*  </div>*/}
            </Stack>
                {/*</div>*/}
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