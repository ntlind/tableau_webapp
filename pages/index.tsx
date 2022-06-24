import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Papa from 'papaparse'

// fake data generator
const metrics = [
  'metric1',
  'metric2',
  'metric3'
]

const dimensions = [
  'dimension1',
  'dimension3'
]

let category_names = {
  0: "Metrics",
  1: "Dimensions",
  2: "Y-Axis",
  3: "X-Axis",
  4: "Grouper"
}

const getItems = (array, offset = 0) =>
  array.map(k => ({
    id: `item-${k + offset}-${new Date().getTime()}`,
    content: `${k}`
  }));

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const copy = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const item = sourceClone[droppableSource.index];
  console.log(destination)
  if (destClone.some(e => e.id === `item-${item.content}`)) {
  } else {
    destClone.splice(droppableDestination.index, 0, { ...item, id: `item-${item.content}` });
  }

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};


function QuoteApp() {
  let isInitialMount = useRef(true)
  const [state, setState] = useState([]); // has to start out empty or the droppable won't work
  const [data, setData] = useState(null); // has to start out empty or the droppable won't work

  useEffect(() => {
    async function fetchData(url: string, setter: any) {
      const response = await fetch(url)
        .then(response => response.text())
        .then(v => Papa.parse(v))
        .catch(err => console.log(err))
      setter(response)
    }

    if (isInitialMount.current) {
      setState([...state, getItems(metrics), getItems(dimensions), [], [], []])
      fetchData('https://raw.githubusercontent.com/facebook/prophet/main/examples/example_retail_sales.csv', setData)
      isInitialMount.current = false
    }
  }, [data])

  function onDragEndDuplicate(result) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      setState(newState);
    } else {
      const result = copy(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setState(newState);
    }
  }

  return (
    <div className='w-60 fixed left-0 h-screen border-r border-gray-200 z-1 shadow-lg'>
      <div className='flex flex-col'>
        <DragDropContext onDragEnd={onDragEndDuplicate}>
          {state.map((el, ind) => (
            <Droppable key={ind} droppableId={`${ind}`} isDropDisabled={ind >= 2 ? false : true}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  className={snapshot.isDraggingOver ? "bg-blue-50 p-4 pb-8" : "bg-white p-4 pb-8"}
                  {...provided.droppableProps}
                >
                  <div className={ind == 2 ? "border-t-2 border-gray-200 pt-8" : null}></div>
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
                          className={snapshot.isDragging ? "bg-blue-900 text-white select-none p-2 ml-4 rounded-xl" : "bg-white select-none p-2 ml-4"}
                        >
                          <div>
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
        </DragDropContext>
      </div>
    </div>
  );
}

const Home: NextPage = () => {
  return (
    <div >
      <Head>
        <title>Tableau Webapp</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className='w-screen-1/2'><QuoteApp /></div>

      </main>

      <footer>
        blah
      </footer>
    </div>
  )
}

export default Home
