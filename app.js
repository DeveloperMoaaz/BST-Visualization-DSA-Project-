class Node {
    constructor(value){
        this.value = value;
        this.left = null;
        this.right = null;
        this.x = 0;
        this.y = 0;
        this.circle = null;
    }
}

let root = null;
let history = [];
const svg = document.getElementById("treeSVG");
const WIDTH = 1000, HEIGHT = 500, LEVEL = 80;
svg.setAttribute("viewBox", `0 0 ${WIDTH} ${HEIGHT}`);

/* Insert */
function insertValue(){
    const input = document.getElementById("valueInput");
    const value = parseInt(input.value);
    if(isNaN(value)) return;
    root = insertNode(root,value);
    history.push(value);
    input.value = "";
    updateUI();
}

function insertNode(node,value){
    if(!node) return new Node(value);
    if(value < node.value) node.left = insertNode(node.left,value);
    else if(value > node.value) node.right = insertNode(node.right,value);
    return node;
}

/* Clear */
function clearTree(){
    root = null;
    history = [];
    svg.innerHTML = svg.innerHTML; // keep defs
    updateUI();
}

/* Update UI */
function updateUI(){
    drawTree();
    document.getElementById("history").textContent = history.join(", ") || "—";
    document.getElementById("count").textContent = countNodes(root);
    document.getElementById("height").textContent = treeHeight(root);
}

/* Draw tree */
function drawTree(){
    svg.innerHTML = svg.innerHTML.split("</defs>")[0]+"</defs>";
    if(!root) return;
    setPos(root, WIDTH/2, 50, WIDTH/4);
    drawEdges(root);
    drawNodes(root);
}

function setPos(node, x, y, offset){
    if(!node) return;
    node.x = Math.max(40,Math.min(x,WIDTH-40));
    node.y = y;
    setPos(node.left, x-offset, y+LEVEL, offset/1.7);
    setPos(node.right, x+offset, y+LEVEL, offset/1.7);
}

function drawEdges(n){
    if(!n) return;
    if(n.left) drawLine(n,n.left);
    if(n.right) drawLine(n,n.right);
    drawEdges(n.left);
    drawEdges(n.right);
}

function drawLine(a,b){
    const l = document.createElementNS("http://www.w3.org/2000/svg","line");
    l.setAttribute("x1",a.x); l.setAttribute("y1",a.y);
    l.setAttribute("x2",b.x); l.setAttribute("y2",b.y);
    l.setAttribute("class","line");
    svg.appendChild(l);
}

function drawNodes(n){
    if(!n) return;
    const c = document.createElementNS("http://www.w3.org/2000/svg","circle");
    c.setAttribute("cx",n.x); c.setAttribute("cy",n.y);
    c.setAttribute("r",20); c.setAttribute("fill","url(#nodeGradient)");
    c.setAttribute("class","node");
    n.circle = c;

    const t = document.createElementNS("http://www.w3.org/2000/svg","text");
    t.setAttribute("x",n.x); t.setAttribute("y",n.y);
    t.setAttribute("class","node-text"); t.textContent=n.value;

    // Group node+text for smooth hover zoom
    const g = document.createElementNS("http://www.w3.org/2000/svg","g");
    g.setAttribute("class","node-group");
    g.appendChild(c);
    g.appendChild(t);
    svg.appendChild(g);

    drawNodes(n.left);
    drawNodes(n.right);
}

/* Traversals */
function showTraversal(type){
    let res=[];
    if(type==="in") inorder(root,res);
    if(type==="pre") preorder(root,res);
    if(type==="post") postorder(root,res);
    document.getElementById("output").textContent=res.join(" → ");
}
function inorder(n,r){ if(!n) return; inorder(n.left,r); r.push(n.value); inorder(n.right,r);}
function preorder(n,r){ if(!n) return; r.push(n.value); preorder(n.left,r); preorder(n.right,r);}
function postorder(n,r){ if(!n) return; postorder(n.left,r); postorder(n.right,r); r.push(n.value);}

/* Search highlight */
function searchValue(){
    const val=parseInt(document.getElementById("valueInput").value);
    if(isNaN(val)) return;
    clearHighlights(root);
    let found=highlightPath(root,val);
    if(!found) alert("Value not found!");
}

function highlightPath(n,val){
    if(!n) return false;
    n.circle.setAttribute("fill","#facc15"); // yellow path
    if(n.value===val){
        n.circle.setAttribute("fill","#22c55e"); // green found
        return true;
    }
    let next = val < n.value ? n.left : n.right;
    if(highlightPath(next,val)) return true;
    n.circle.setAttribute("fill","url(#nodeGradient)"); // reset if not on path
    return false;
}

function clearHighlights(n){ if(!n) return; n.circle.setAttribute("fill","url(#nodeGradient)"); clearHighlights(n.left); clearHighlights(n.right); }

/* Stats */
function countNodes(n){ return n?1+countNodes(n.left)+countNodes(n.right):0;}
function treeHeight(n){ return n?1+Math.max(treeHeight(n.left),treeHeight(n.right)):0;}