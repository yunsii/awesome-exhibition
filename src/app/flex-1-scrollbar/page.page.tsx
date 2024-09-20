export default async function Page() {
  return (
    <>
      <div className='h-[50vh] bg-slate-50 flex'>
        <div>Vertical Scrollbar</div>
        <div className='flex flex-1 flex-col'>
          <div className='bg-slate-100'>Nest 1</div>
          <div className='flex flex-1 h-0'>
            <div className='bg-slate-200'>Nest 2</div>
            <div className='flex-1 flex flex-col'>
              <div className='bg-slate-300'>Nest 3</div>
              <div className='flex-1 h-0 overflow-y-auto bg-cyan-200'>
                {Array.from({ length: 200 }).map((_, index) => {
                  return index
                }).map((item) => {
                  return <div key={item}>{item}</div>
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='h-[50vh] bg-slate-50 flex'>
        <div>Horizontal Scrollbar</div>
        <div className='flex flex-1 flex-col'>
          <div className='bg-slate-100'>Nest 1</div>
          <div className='flex flex-1 h-0'>
            <div className='bg-slate-200'>Nest 2</div>
            <div className='flex-1 flex flex-col'>
              <div className='bg-slate-300'>Nest 3</div>
              <div className='flex-1 flex'>
                <div className='bg-slate-400'>Nest 4</div>
                <div className='flex flex-1 w-0 overflow-x-auto bg-cyan-200 gap-1'>
                  {Array.from({ length: 200 }).map((_, index) => {
                    return index
                  }).map((item) => {
                    return <div key={item}>{item}</div>
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className='h-[50vh] bg-slate-300 flex flex-row'>
        <div>Horizontal Scrollbar</div>
        <div className='flex flex-1 w-0 overflow-auto bg-cyan-200'>
          {Array.from({ length: 100 }).map((_, index) => {
            return index
          }).map((item) => {
            return <div key={item}>{item}</div>
          })}
        </div>
      </div> */}
    </>
  )
}
