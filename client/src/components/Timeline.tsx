import React from "react"
import { Movie } from "../../server/src/types"
import MovieCard from "./MovieCard"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"

interface TimelineProps {
  movies: Movie[]
  onPlace: (sourceIndex: number, destinationIndex: number) => void
}

export default function Timeline({ movies, onPlace }: TimelineProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return
    onPlace(result.source.index, result.destination.index)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="timeline" direction="horizontal">
        {provided => (
          <div
            className="flex gap-2 overflow-x-auto p-2 border rounded"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {movies.map((movie, idx) => (
              <Draggable key={movie.id} draggableId={movie.id} index={idx}>
                {provided => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <MovieCard movie={movie} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}