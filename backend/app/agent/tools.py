import math
from typing import Optional

from langchain_core.tools import BaseTool, tool
from pydantic import BaseModel

from ..rag.vectorstore import FAISSVectorStore


class FreightResult(BaseModel):
    origin: str
    destination: str
    weight_kg: float
    mode: str
    distance_km: float
    base_cost_usd: float
    fuel_surcharge: float
    total_cost_usd: float
    transit_days: str
    currency: str = "USD"


HUB_COORDS: dict[str, tuple[float, float]] = {
    "mumbai": (19.08, 72.88),
    "delhi": (28.61, 77.21),
    "chennai": (13.08, 80.27),
    "dubai": (25.20, 55.27),
    "singapore": (1.35, 103.82),
    "hong kong": (22.32, 114.17),
    "london": (51.51, -0.13),
    "frankfurt": (50.11, 8.68),
    "rotterdam": (51.92, 4.48),
    "new york": (40.71, -74.01),
    "los angeles": (34.05, -118.24),
    "chicago": (41.88, -87.63),
    "shanghai": (31.23, 121.47),
    "beijing": (39.91, 116.39),
    "tokyo": (35.68, 139.69),
    "sydney": (-33.87, 151.21),
}

RATE_TABLE: dict[str, float] = {
    "air": 0.007,
    "sea": 0.0003,
    "road": 0.001,
    "rail": 0.0005,
}

TRANSIT_DAYS: dict[str, str] = {
    "air": "1–3 business days",
    "sea": "18–45 days",
    "road": "3–14 days",
    "rail": "10–25 days",
}

FUEL_SURCHARGE_PCT = 0.12


def _haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + (
        math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )
    return R * 2 * math.asin(math.sqrt(a))


def make_rag_tool(store: FAISSVectorStore) -> BaseTool:
    @tool(
        "rag",
        description=(
            "Search the supply-chain knowledge base for logistics policies, "
            "shipping terms, trade regulations, and general industry knowledge. "
            "Input: a natural-language query string. "
            "Output: concatenated relevant text passages."
        ),
    )
    def rag(query: str) -> str:
        docs = store.similarity_search(query, k=store.settings.top_k_retrieval)
        if not docs:
            return "No relevant documents found in the knowledge base."
        return "\n\n---\n\n".join(d.page_content for d in docs)

    return rag


@tool(
    "freight",
    description=(
        "Calculate estimated freight cost between two cities. "
        "Args: origin(str), destination(str), weight_kg(float), "
        "mode(str: air|sea|road|rail)."
    ),
)
def freight(
    origin: str,
    destination: str,
    weight_kg: float,
    mode: str = "air",
) -> str:
    o = origin.lower().strip()
    d = destination.lower().strip()
    m = mode.lower().strip()

    if o not in HUB_COORDS or d not in HUB_COORDS:
        return f"Unknown city. Supported hubs: {list(HUB_COORDS.keys())}"

    if m not in RATE_TABLE:
        return "Unknown mode. Supported: air, sea, road, rail"

    dist = _haversine(*HUB_COORDS[o], *HUB_COORDS[d])
    base = round(RATE_TABLE[m] * weight_kg * dist, 2)
    fuel = round(base * FUEL_SURCHARGE_PCT, 2)
    total = round(base + fuel, 2)

    return FreightResult(
        origin=origin,
        destination=destination,
        weight_kg=weight_kg,
        mode=m,
        distance_km=round(dist, 1),
        base_cost_usd=base,
        fuel_surcharge=fuel,
        total_cost_usd=total,
        transit_days=TRANSIT_DAYS[m],
    ).model_dump_json(indent=2)


def build_tools(store: FAISSVectorStore, settings: object) -> list:
    return [make_rag_tool(store), freight]
