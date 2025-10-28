<template>
  <div class="mind-map-view bg-white rounded-2xl shadow-lg p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-bold text-gray-900">Mind Map</h3>
      <div class="flex gap-2">
        <button
          @click="resetZoom"
          class="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-all"
        >
          Reset View
        </button>
        <button
          @click="exportImage"
          class="px-3 py-1 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-all"
        >
          Export PNG
        </button>
      </div>
    </div>

    <div
      ref="containerRef"
      class="relative bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl overflow-hidden"
      style="height: 600px"
    >
      <svg ref="svgRef" class="w-full h-full"></svg>
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/80">
        <div class="text-center">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"
          ></div>
          <p class="text-gray-600">Generating mind map...</p>
        </div>
      </div>
    </div>

    <div class="mt-4 flex items-center gap-4 text-sm text-gray-600">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-blue-500"></div>
        <span>Heading</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-green-500"></div>
        <span>Definition</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-orange-500"></div>
        <span>Example</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-purple-500"></div>
        <span>Summary</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import * as d3 from "d3";
import html2canvas from "html2canvas";

const props = defineProps<{
  content: string;
}>();

const svgRef = ref<SVGSVGElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);
const loading = ref(true);

interface Node {
  id: string;
  label: string;
  type: "heading" | "bullet" | "definition" | "example" | "summary";
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface Link {
  source: string | Node;
  target: string | Node;
}

const nodeColors = {
  heading: "#3b82f6",
  bullet: "#6b7280",
  definition: "#10b981",
  example: "#f59e0b",
  summary: "#8b5cf6",
};

function parseContent(content: string): { nodes: Node[]; links: Link[] } {
  const lines = content.split("\n").filter((line) => line.trim());
  const nodes: Node[] = [];
  const links: Link[] = [];
  let lastHeading: string | null = null;
  let lastBullet: string | null = null;

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    const id = `node-${index}`;
    let type: Node["type"] = "bullet";
    let label = trimmed;

    // Classify line type
    if (trimmed.startsWith("# ") || trimmed.startsWith("## ")) {
      type = "heading";
      label = trimmed.replace(/^#+\s*/, "");
      lastHeading = id;
    } else if (
      trimmed.toLowerCase().includes("definition:") ||
      trimmed.toLowerCase().includes("means:")
    ) {
      type = "definition";
    } else if (
      trimmed.toLowerCase().includes("example:") ||
      trimmed.toLowerCase().includes("e.g.")
    ) {
      type = "example";
    } else if (
      trimmed.toLowerCase().includes("summary:") ||
      trimmed.toLowerCase().includes("in conclusion")
    ) {
      type = "summary";
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      type = "bullet";
      label = trimmed.replace(/^[-*]\s*/, "");
    }

    // Truncate long labels
    if (label.length > 50) {
      label = label.substring(0, 47) + "...";
    }

    nodes.push({ id, label, type });

    // Create links
    if (type === "heading") {
      lastHeading = id;
      lastBullet = null;
    } else if (lastHeading) {
      links.push({ source: lastHeading, target: id });
      if (type === "bullet") {
        lastBullet = id;
      }
    }

    // Link related nodes
    if (type === "definition" && lastBullet) {
      links.push({ source: lastBullet, target: id });
    }
    if (type === "example" && lastBullet) {
      links.push({ source: lastBullet, target: id });
    }
  });

  return { nodes, links };
}

function renderMindMap() {
  if (!svgRef.value || !containerRef.value) return;

  loading.value = true;

  const { nodes, links } = parseContent(props.content);

  if (nodes.length === 0) {
    loading.value = false;
    return;
  }

  const width = containerRef.value.clientWidth;
  const height = containerRef.value.clientHeight;

  const svg = d3.select(svgRef.value);
  svg.selectAll("*").remove();

  const g = svg.append("g");

  // Zoom behavior
  const zoom = d3
    .zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.1, 4])
    .on("zoom", (event) => {
      g.attr("transform", event.transform);
    });

  svg.call(zoom);

  // Force simulation
  const simulation = d3
    .forceSimulation(nodes as d3.SimulationNodeDatum[])
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d: any) => d.id)
        .distance(100)
    )
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(50));

  // Links
  const link = g
    .append("g")
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke", "#94a3b8")
    .attr("stroke-width", 2)
    .attr("stroke-opacity", 0.6);

  // Nodes
  const node = g
    .append("g")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .call(
      d3
        .drag<SVGGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any
    );

  node
    .append("circle")
    .attr("r", (d) => (d.type === "heading" ? 30 : 20))
    .attr("fill", (d) => nodeColors[d.type])
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .style("cursor", "pointer");

  node
    .append("text")
    .text((d) => d.label)
    .attr("x", 0)
    .attr("y", (d) => (d.type === "heading" ? 45 : 35))
    .attr("text-anchor", "middle")
    .attr("font-size", (d) => (d.type === "heading" ? "14px" : "12px"))
    .attr("fill", "#374151")
    .attr("font-weight", (d) => (d.type === "heading" ? "bold" : "normal"))
    .each(function (d) {
      const text = d3.select(this);
      const words = d.label.split(/\s+/);
      text.text("");

      let line: string[] = [];
      let lineNumber = 0;
      const lineHeight = 1.1;
      const y = parseFloat(text.attr("y"));
      const maxWidth = d.type === "heading" ? 80 : 60;

      words.forEach((word) => {
        line.push(word);
        const testLine = line.join(" ");
        text.text(testLine);

        if (text.node()!.getComputedTextLength() > maxWidth) {
          line.pop();
          text.text(line.join(" "));

          const tspan = text
            .append("tspan")
            .attr("x", 0)
            .attr("y", y)
            .attr("dy", `${lineNumber * lineHeight}em`)
            .text(line.join(" "));

          line = [word];
          lineNumber++;
        }
      });

      if (line.length > 0) {
        text
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", `${lineNumber * lineHeight}em`)
          .text(line.join(" "));
      }
    });

  // Hover effects
  node.on("mouseenter", function () {
    d3.select(this)
      .select("circle")
      .attr("r", (d: any) => (d.type === "heading" ? 35 : 25));
  });

  node.on("mouseleave", function () {
    d3.select(this)
      .select("circle")
      .attr("r", (d: any) => (d.type === "heading" ? 30 : 20));
  });

  simulation.on("tick", () => {
    link
      .attr("x1", (d: any) => d.source.x)
      .attr("y1", (d: any) => d.source.y)
      .attr("x2", (d: any) => d.target.x)
      .attr("y2", (d: any) => d.target.y);

    node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
  });

  function dragstarted(event: any, d: any) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event: any, d: any) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event: any, d: any) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  setTimeout(() => {
    loading.value = false;
  }, 1000);
}

function resetZoom() {
  if (!svgRef.value) return;
  const svg = d3.select(svgRef.value);
  svg
    .transition()
    .duration(750)
    .call(d3.zoom<SVGSVGElement, unknown>().transform as any, d3.zoomIdentity);
}

async function exportImage() {
  if (!containerRef.value) return;

  try {
    const canvas = await html2canvas(containerRef.value);
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "mindmap.png";
    link.href = url;
    link.click();
  } catch (error) {
    console.error("Error exporting image:", error);
  }
}

onMounted(() => {
  renderMindMap();
});

watch(
  () => props.content,
  () => {
    renderMindMap();
  }
);
</script>
