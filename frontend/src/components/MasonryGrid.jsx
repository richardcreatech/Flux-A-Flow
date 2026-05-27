const heights = [15, 20, 10, 25, 30];
// colors optional — remove if all gray
const colors = ["#ff6f61", "#6b5b95", "#88b04b", "#d65076", "#ffb347"];


function MasonryGrid({ items }) {
  return (
    <div className="masonry">
      {items.map((item, i) => (
        <div
          key={item.id}
          className="item"
          style={{
            gridRow: `span ${heights[i % heights.length]}`,
            backgroundColor: ,
          }}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}

export default MasonryGrid;