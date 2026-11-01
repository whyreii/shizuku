const q = `query{Page(perPage:14){characters(sort:FAVOURITES_DESC){name{full} favourites image{large} media(perPage:1){nodes{title{romaji}}}}}}`;
const res = await fetch("https://graphql.anilist.co", {
  method: "POST",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  body: JSON.stringify({ query: q }),
});
const j = await res.json();
if (j.errors) { console.log("ERR", JSON.stringify(j.errors)); process.exit(1); }
const out = j.data.Page.characters.map(c => ({
  name: c.name.full,
  series: c.media.nodes[0]?.title.romaji ?? "?",
  img: c.image.large,
}));
console.log(JSON.stringify(out, null, 1));