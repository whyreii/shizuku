import io

p = "scripts/build-roster.mjs"
s = io.open(p, encoding="utf-8").read()

s = s.replace(
    """        nodes: nodes.map((node) => ({
          id: node.id,
          name: node.name.full,
          favourites: node.favourites ?? 0,
          image: node.image?.large ?? null,
        })),""",
    """        nodes: nodes.map((node) => ({
          id: node.id,
          name: node.name.full,
          favourites: node.favourites ?? 0,
          image: node.image?.large ?? null,
          series: title,
        })),""",
)

s = s.replace(
    """  const tuples = extra.map((node, index) => [
    `a${node.id}`,
    node.name,
    cache.media.find((m) => blockOf(cache, m.id)?.nodes.includes(node))?.title?.romaji ||
      "Unknown",
    1000 + index + 1,
    node.image ?? null,
  ]);""",
    """  const tuples = extra.map((node, index) => [
    `a${node.id}`,
    node.name,
    node.series || "Unknown",
    1000 + index + 1,
    node.image ?? null,
  ]);""",
)

s = s.replace(
    """function blockOf(cache, mediaId) {
  return cache.characters[mediaId];
}

""",
    "",
)

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("script fixed")
