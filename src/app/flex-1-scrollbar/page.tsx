import { FluentFlex, FluentFlexSize } from './components/FluentFlex'

export default async function Page() {
  return (
    <>
      <FluentFlex debug className='h-[45vh] bg-slate-50'>
        <div>Root</div>
        <FluentFlex debug className='bg-slate-100'>
          <div>Nest 1</div>
          <FluentFlex debug className='bg-slate-200'>
            <div>Nest 2</div>
            <FluentFlex debug className='bg-slate-300'>
              <div>Nest 3</div>
              <FluentFlex debug className='bg-slate-400'>
                {Array.from({ length: 200 }).map((_, index) => {
                  return index
                }).map((item) => {
                  return <div key={item}>{item}</div>
                })}
              </FluentFlex>
            </FluentFlex>
          </FluentFlex>
        </FluentFlex>
      </FluentFlex>
      <div>-----------</div>
      <FluentFlex debug className='h-[45vh] bg-slate-50'>
        <div>Root</div>
        <FluentFlex debug className='bg-slate-100'>
          <div>Nest 1</div>
          <FluentFlex debug className='bg-slate-200'>
            <div>Nest 2</div>
            <FluentFlex debug className='bg-slate-300'>
              <div>Nest 3</div>
              <FluentFlexSize className='bg-slate-400 min-w-[300vw] min-h-screen'>
                {Array.from({ length: 100 }).map((_, index) => {
                  return index
                }).map((item) => {
                  return (
                    <div key={item}>
                      {item}
                    </div>
                  )
                })}
              </FluentFlexSize>
            </FluentFlex>
          </FluentFlex>
        </FluentFlex>
      </FluentFlex>
    </>
  )
}
