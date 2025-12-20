import Konva from 'konva'
import React, { useEffect, useRef, useState } from 'react'
import { Circle, Layer, Rect, Stage, Text } from 'react-konva'

export interface KonvaStudioProps {
}

function KonvaStudio(props: KonvaStudioProps) {
  // Define virtual size for our scene
  const sceneWidth = 1000
  const sceneHeight = 1000

  const [drawing, setDrawing] = useState(false)
  // State to track current scale and dimensions
  const [stageSize, setStageSize] = useState({
    width: sceneWidth,
    height: sceneHeight,
  })
  const stageRef = useRef<Konva.Stage>(null)
  const layerRef = useRef<Konva.Layer>(null)
  const drawingLineRef = useRef<Konva.Line | null>(null)

  // Reference to parent container
  const containerRef = useRef<HTMLDivElement>(null)

  // Function to handle resize
  const updateSize = () => {
    if (!containerRef.current) {
      return
    }

    // Update state with new dimensions
    setStageSize({
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight,
    })
  }

  // Update on mount and when window resizes
  useEffect(() => {
    updateSize()
    window.addEventListener('resize', updateSize)

    return () => {
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault()

    const stage = stageRef.current

    if (!stage) {
      return
    }

    const oldScale = stage.scaleX()
    const pointer = stage.getPointerPosition()

    if (!pointer) {
      return
    }

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    }

    // how to scale? Zoom in? Or zoom out?
    let direction = e.evt.deltaY > 0 ? 1 : -1

    // when we zoom on trackpad, e.evt.ctrlKey is true
    // in that case lets revert direction
    if (e.evt.ctrlKey) {
      direction = -direction
    }

    const scaleBy = 1.1
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy

    stage.scale({ x: newScale, y: newScale })

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    }
    stage.position(newPos)
  }

  return (
    <div
      ref={containerRef}
      className='flex-1 overflow-hidden'
    >
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        className='bg-gray-300'
        onWheel={handleWheel}
        onMouseDown={(e) => {
          if (!stageRef.current) {
            return
          }

          setDrawing(true)
          const startPos = stageRef.current.getRelativePointerPosition()

          if (!startPos) {
            return
          }

          drawingLineRef.current = new Konva.Line({
            points: [startPos.x, startPos.y],
            stroke: 'black',
            strokeWidth: 2,
            lineCap: 'round',
            lineJoin: 'round',
          })
          layerRef.current?.add(drawingLineRef.current)
        }}
        onMouseMove={() => {
          if (!stageRef.current) {
            return
          }
          if (!drawingLineRef.current) {
            return
          }
          const currentPos = stageRef.current.getRelativePointerPosition()
          if (!currentPos) {
            return
          }
          drawingLineRef.current.points(drawingLineRef.current.points().concat([currentPos.x, currentPos.y]))
          layerRef.current?.batchDraw()
        }}
        onMouseUp={() => {
          if (!stageRef.current) {
            return
          }
          setDrawing(false)
          drawingLineRef.current = null
        }}
      >
        <Layer ref={layerRef}>
          <Text text='Try to drag shapes' fontSize={15} />
          <Rect
            x={20}
            y={50}
            width={100}
            height={100}
            fill='red'
            shadowBlur={10}
            draggable
            onDragEnd={(e) => {
              e.target.to({
                duration: 0.1,
              })
            }}
          />
          <Circle
            x={200}
            y={100}
            radius={50}
            fill='green'
            draggable
            onDragEnd={(e) => {
              e.target.to({
                duration: 0.1,
              })
            }}
          />
        </Layer>
      </Stage>
    </div>
  )
}

export default KonvaStudio
