import "./Tile.css";

interface Props {
  image?: string;
  number: number;
  highlight: boolean;
  position: string;
}

/**
 * Tile component
 * @param number - The number of the tile
 * @param image - The image of the piece on the tile
 * @param highlight - whether title color is white or black
 * @param position - The position of the tile
 * @returns
 */
export default function Tile({ number, image, highlight, position }: Props) {
  const className: string = [
    "tile",
    number % 2 === 0 && "black-tile",
    number % 2 !== 0 && "white-tile",
    highlight && "tile-highlight",
    image && "chess-piece-tile",
  ]
    .filter(Boolean)
    .join(" ");
  // console.log(position);
  return (
    <div className={className}>
      {/* <div className="position-label top-left">
          {position.split(",").join("")}
        </div> */}
      {image && (
        <div
          style={{ backgroundImage: `url(${image})` }}
          className="chess-piece"
        ></div>
      )}
    </div>
  );
}
