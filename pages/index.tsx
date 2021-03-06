import type { NextPage } from 'next'
import Head from 'next/head'
import DataSelector from '../components/SideBar'
import BarChart from '../components/D3/Barchart'
import { useEffect, useState, useRef } from 'react'
import HeaderBar from '../components/HeaderBar'
import Dropzone from 'react-dropzone'
import { UploadIcon } from '@heroicons/react/solid'
import LoadD3File from '../components/LoadD3File'
import DataTable from '../components/DataTable'

const Home: NextPage = () => {
  const isMounted = useRef(false)
  const [state, setState] = useState<any>([]);
  const [dark, setDark] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [data, setData] = useState<any>({
    data: null, cols: {}, classifications: null, chartType: "BarChart", bg: "#fff", recentColors: ['#ff562e', '#0000bb', '#bb0091', '#f8005e']
  });


  useEffect(() => {

    if ((data.data != null) && (isLoaded == false)) {

      setIsLoaded(true)
    }

    return () => {
      isMounted.current = false;
    };
  }, [state, data])


  function getArrayItems(index: number) {
    return state[index] && state[index].map((element: any) => element.content)
  }

  function getRows() {
    return getArrayItems(2)
  }

  function getColumns() {
    return getArrayItems(3)
  }

  function getSelectionDimensions() {
    return getArrayItems(2) && getArrayItems(2).concat(getArrayItems(3)).map((element: any) => data.cols && data.cols[element] && data.cols[element].classification)
  }

  function isBarChartReady() {
    return getSelectionDimensions() && ['metric', 'dimension'].every((value) => getSelectionDimensions().includes(value)) && data.chartType == 'BarChart'
  }

  function getGroupers() {
    return getArrayItems(4)
  }

  function DropZoneComponent() {
    return (
      <Dropzone
        maxFiles={1}
        // noClick={true}
        // noDrag={true}
        maxSize={1024 * 1024 * 50}
        // accept=".csv, text/csv, application/vnd.ms-excel, application/csv, text/x-csv, application/x-csv, text/comma-separated-values, text/x-comma-separated-values, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/plain, application/vnd.ms-excel"
        onDrop={async ([file]) => {
          var reader = new FileReader();
          reader.onload = function (e) {
            var contents = e && e.target?.result;

            let csv = LoadD3File(contents as string)
              .then((response: any) => {
                setData({ ...data, data: response['array'], cols: response['col_obj'] })
              })

          };
          reader.readAsDataURL(file);
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <div className="h-full col-span-12 lg:col-span-3">
            <section className='flex items-center justify-center w-full h-full mt-4 border-2 border-dashed border-zinc-400 lg:mt-0'>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <UploadIcon className='w-20 h-20 mb-3 opacity-50 fill-zinc-500' />
                  <div className="text-xl font-semibold xl:text-2xl">Click or drop files here.</div>
                  <div className="mx-4 mt-2 text-zinc-500">Accepted formats are csv and xlsx</div>
                </div>
              </div>
            </section>
          </div>
        )}
      </Dropzone>
    )
  }

  return (
    <div >
      <Head>
        <title>Tableau Webapp</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={dark ? 'w-screen h-screen  dark' : 'w-screen h-screen'}>
        <DataSelector state={state} setState={setState} data={data} setData={setData} />
        <HeaderBar isOn={dark} setIsOn={(e: any) => setDark(e)} data={data} setData={setData} />
        <div className='grid h-full grid-rows-4 ml-60' style={{ background: data.bg }}>
          <div className='w-full row-span-3 p-24'>
            {data.data ? (isBarChartReady() && <BarChart data={[1, 2, 3]} xVar={getColumns()[0]} yVar={getRows()[0]} />) : <DropZoneComponent />}
          </div>
          <div className='relative row-span-1 overflow-x-auto border-t border-zinc-200'>
            {data.data && <DataTable array={data.data} />}
          </div>
        </div>
      </main>
      {/* 
      <footer className='flex items-center ml-60 h-screen-1/12'>
        graphic
      </footer> */}
    </div>
  )
}

export default Home
