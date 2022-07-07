import { useEffect, useState, useRef } from 'react';
// @ts-ignore
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { getIndexOfString, copy, category_names, getItems, reorder, fetchData, getTypeIconList } from '../components/DragAndDrop/DragAndDrop'
import CustomListBox from './Listboxes/IconListbox';

let dataURL = {
    line: 'https://raw.githubusercontent.com/facebook/prophet/main/examples/example_retail_sales.csv',
    bar: "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv"
}

interface IProps {
    state: any;
    setState: any;
    data: any;
    setData: any
}

export default function DataSelector({ state, setState, data, setData }: IProps) {
    let isInitialMount = useRef(true)

    useEffect(() => {
        if (isInitialMount.current) {
            fetchData(dataURL.bar, data, setData)
            isInitialMount.current = false
        }
        if ((data.classifications) && (state.length === 0)) {
            let metric_array = Array(data.classifications!['metric'])
            let dimension_array = Array(data.classifications!['dimension'])
            // @ts-ignore
            setState([...state, getItems(metric_array), getItems(dimension_array), [], [], []])
        }

    }, [data, state])

    function onDragEndDuplicate(result: any) {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }
        const sInd = +source.droppableId;
        const dInd = +destination.droppableId;

        if (sInd === dInd) {
            const items = reorder(state[sInd], source.index, destination.index);
            const newState: any = [...state];
            newState[sInd] = items;
            setState(newState);
        } else {
            let result: any = copy(state[sInd], state[dInd], source, destination);
            const newState: any = [...state];
            newState[sInd] = result[sInd];
            newState[dInd] = result[dInd];

            setState(newState);
        }
    }

    let iconList = getTypeIconList()
    let typeChoices = Object.keys(iconList).map((key, index) => ({ value: key, id: index }))

    function updateType(e: any, content: string) {
        let newData = data
        newData.cols[content].type = e
        setData({ ...newData })
    }

    return (
        <div className='fixed left-0 z-10 h-screen border-r border-gray-200 shadow-lg w-60'>
            <div className='flex flex-col'>
                <DragDropContext onDragEnd={onDragEndDuplicate}>
                    {state.map((el, ind) => (
                        <Droppable key={ind} droppableId={`${ind}`} isDropDisabled={ind >= 2 ? false : true}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    className={snapshot.isDraggingOver ? "bg-blue-50 p-4 pb-6" : "bg-white p-4 pb-6"}
                                    {...provided.droppableProps}
                                >
                                    <div className={ind == 2 ? "border-t-2 border-gray-200 pt-6" : ""}></div>
                                    <div className='font-bold underline'>
                                        {category_names[ind]}
                                    </div>
                                    {el.map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={snapshot.isDragging ? "bg-blue-900 text-white select-none py-2 px-1 rounded-xl" : "bg-white select-none py-2"}
                                                >
                                                    <div className='flex flex-row items-center'>
                                                        <div className='pr-2'>
                                                            <CustomListBox id={`item-${item.content}-${new Date().getTime()}`} choices={typeChoices} selected={data.cols[item.content].type} onChange={e => updateType(e, item.content)} iconMap={iconList} />
                                                        </div>
                                                        {item.content}
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                    <button className='absolute z-10 theme-button rounded left-[4.5rem] bottom-6 w-24' onClick={(e) => setState([state[0], state[1], [], [], []])}>Reset</button>
                </DragDropContext>
            </div>
        </div >
    );
}