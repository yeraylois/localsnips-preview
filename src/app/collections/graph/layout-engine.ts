/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : layout-engine.ts                               *
 *   Purpose : DETERMINISTIC LAYOUT ENGINE FOR HIERARCHICAL GRAPH DATA *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

/**
 * REPRESENTS A NODE IN THE VISUALIZATION GRAPH.
 */
export interface GraphNode {
    id: string;
    type: "root" | "group" | "item";
    children?: GraphNode[];
    x?: number;
    y?: number;
    width?: number; // USED FOR SIZING
    [key: string]: unknown; // ALLOW EXTRA PROPS FROM FORCE-GRAPH
};

/**
 * REPRESENTS A LINK BETWEEN TWO NODES.
 */
export interface GraphLink {
    source: string | GraphNode;
    target: string | GraphNode;
};



interface Dimensions {
    x: number;
    y: number;
}

/**
 * CALCULATES A STRICT TREE LAYOUT.
 * RETURNS A MAP OF NODE IDS TO {X, Y} COORDINATES.
 * @param nodes GRAPH NODES ARRAY
 * @param links GRAPH LINKS ARRAY
 * @param rootId ID OF THE ROOT NODE
 * @param mode LAYOUT MODE (TREE/HORIZONTAL/BOTTOMUP)
 * @param canvasWidth CANVAS WIDTH IN PIXELS (DEFAULT: 1000)
 * @param canvasHeight CANVAS HEIGHT IN PIXELS (DEFAULT: 800)
 * @returns MAP OF NODE IDS TO COORDINATES
 */
export function calculateTreeLayout(
    nodes: GraphNode[],
    links: GraphLink[],
    rootId: string,
    mode: "tree" | "horizontal" | "bottomup",
    canvasWidth: number = 1000,
    canvasHeight: number = 800
): Map<string, { x: number, y: number }> {
    
    // 1. BUILD THE TREE STRUCTURE
    const nodeMap = new Map<string, GraphNode>();
    nodes.forEach(n => {
        nodeMap.set(n.id, { ...n, children: [] });
    });

    const root = nodeMap.get(rootId);
    if (!root) return new Map();

    const visited = new Set<string>();
    
    // HELPER TO BUILD HIERARCHY SAFELY
    const buildHierarchy = (parentId: string) => {
        const parent = nodeMap.get(parentId);
        if (!parent || visited.has(parentId)) return;
        visited.add(parentId);

        // FIND ALL LINKS WHERE SOURCE IS THIS PARENT
        const childLinks = links.filter(l => 
            (typeof l.source === 'object' ? (l.source as GraphNode).id : l.source) === parentId
        );
        
        childLinks.forEach(link => {
            const targetId = typeof link.target === 'object' ? (link.target as GraphNode).id : (link.target as string);
            const child = nodeMap.get(targetId);
            if (child && !visited.has(targetId)) {
                if (!parent.children) parent.children = [];
                parent.children.push(child);
                buildHierarchy(targetId);
            }
        });

        // SORT CHILDREN ALPHABETICALLY EFFECTIVELY CLUSTERS SIMILAR ITEMS
        if (parent && parent.children) {
             parent.children.sort((a: GraphNode, b: GraphNode) => a.id.localeCompare(b.id));
        }
    };

    buildHierarchy(rootId);

    // 2. TREE LAYOUT ALGORITHM
    // WE'LL GIVE EVERY ITEM A FIXED WIDTH BOX
    const NODE_SIZE = 60;
    
    // ADJUSTABLE SPACING
    let spacingX = 50; 
    let spacingY = 120; // LEVEL DEPTH

    // CALCULATE INITIAL POSITIONS (RELATIVE)
    const positions = new Map<string, { x: number, y: number }>();
    
    let currentX = 0;
    
    // BASIC LAYOUT PASS
    const layoutNode = (node: GraphNode, depth: number) => {
        if (!node.children || node.children.length === 0) {
            // LEAF NODE
            node.x = currentX;
            node.y = depth * spacingY;
            currentX += NODE_SIZE + spacingX;
        } else {
            // INTERNAL NODE
            let firstChildX = -1;
            let lastChildX = -1;
            
            if (node.children) {
                node.children.forEach((child: GraphNode, i: number) => {
                    layoutNode(child, depth + 1);
                    if (i === 0) firstChildX = child.x!;
                    if (i === node.children!.length - 1) lastChildX = child.x!;
                });
            }
            
            node.x = (firstChildX + lastChildX) / 2;
            node.y = depth * spacingY;
        }
        
        positions.set(node.id, { x: node.x, y: node.y });
    };

    // FIRST PASS TO DETERMINE NATURAL WIDTH
    layoutNode(root, 0);
    
    // 3. SCALING LOGIC
    // SCALE DEPTH TO FIT 95% OF SCREEN WIDTH IF IN HORIZONTAL MODE
    // INCREASED FROM 90% AND ADDED LARGER MINIMUM SPACING (300PX)
    
    if (mode === "horizontal") {
        // FIND MAX DEPTH
        let maxDepth = 0;
        positions.forEach(p => {
             // P.Y IS CURRENTLY DEPTH * INITIALSPACINGY (120)
             const depth = p.y / 120; 
             if (depth > maxDepth) maxDepth = depth;
        });
        
        // TARGET WIDTH = 95% OF CANVAS WIDTH (WIDER)
        const targetWidth = canvasWidth * 0.95;
        
        if (maxDepth > 0) {
            const newSpacingY = targetWidth / maxDepth;
            // APPLY LARGER MINIMUM SPACING TO ENSURE COLUMNS ARE SEPARATED
            // WAS 120, NOW 300
            spacingY = Math.max(300, newSpacingY);
        }
    }
    
    // RE-CALCULATE WITH NEW SPACING
    positions.clear();
    currentX = 0;
    layoutNode(root, 0); // RE-RUN WITH UPDATED SPACING GLOBALS

    // 4. TRANSFORM & CENTER
    // MEASURE FINAL BOUNDS
    const allX = Array.from(positions.values()).map(p => p.x);
    const allY = Array.from(positions.values()).map(p => p.y);
    const minX = Math.min(...allX);
    const maxX = Math.max(...allX);
    const minY = Math.min(...allY);
    const maxY = Math.max(...allY);
    
    const contentHeight = maxY - minY;
    
    // CENTER ALIGNMENT OFFSETS
    let offsetX = -(minX + maxX) / 2; // CENTERS X ON 0
    let offsetY = -(minY + maxY) / 2; // CENTERS Y ON 0
    
    // OFFSET FOR TOP BAR
    const topSafeZone = -canvasHeight / 2 + 150; // 150PX FROM TOP (INCREASED SAFE ZONE)
    const leftSafeZone = -canvasWidth / 2 + 50;
    
    positions.forEach(pos => {
        // APPLY CENTERING FIRST
        pos.x += offsetX;
        pos.y += offsetY;
    });

    // 5. ROTATION & PLACEMENT
    const finalPositions = new Map<string, { x: number, y: number }>();

    if (mode === "horizontal") {
        // ROTATE & ALIGN LEFT
        positions.forEach((pos, id) => {
            // SWAP X/Y
            // POS.Y (DEPTH) BECOMES X.
            // POS.X (BREADTH) BECOMES Y.
            
            // X: MAP FROM CENTERED TO LEFT-ALIGNED + SPACING
            const normalizedDepth = pos.y - (-contentHeight/2);
            const finalX = leftSafeZone + normalizedDepth; // START AT LEFT EDGE
            
            // Y: CENTERED VERTICAL
            const finalY = pos.x; 
            
            finalPositions.set(id, { x: finalX, y: finalY });
        });
        
    } else if (mode === "bottomup") {
         positions.forEach((pos, id) => {
            // FLIP Y
             const normalizedDepth = pos.y - (-contentHeight/2);
             // BOTTOM IS +CANVASHEIGHT/2.
             const finalY = (canvasHeight/2 - 150) - normalizedDepth;
             finalPositions.set(id, { x: pos.x, y: finalY });
        });
        
    } else {
        // STANDARD TREE (TOP DOWN)
        // MOVE TOP TO TOPSAFEZONE
        positions.forEach((pos, id) => {
             const normalizedDepth = pos.y - (-contentHeight/2);
             const finalY = topSafeZone + normalizedDepth;
             finalPositions.set(id, { x: pos.x, y: finalY });
        });
    }

    return finalPositions;
}
