import type { INode } from "@/types/component/common/ITreeData";

export function getDepthTreeData(item: any): number {
  if (!item.children || item.children.length === 0) {
    return 1; // Nếu không có child, độ sâu là 1
  } else if (Array.isArray(item.children)) {
    // Nếu có child là một mảng, tính độ sâu của child đầu tiên và cộng thêm 1
    return 1 + Math.max(...(item.children as any[]).map(getDepthTreeData));
  } else {
    // Nếu có child là một đối tượng, tính độ sâu của child đó và cộng thêm 1
    return 1 + getDepthTreeData(item.children);
  }
}

export function removeDuplicateTreeData(data: any[]): any[] {
  const idMap: Record<string, boolean> = {};
  const result: any[] = [];

  // Iterate through the data array
  data.forEach((item) => {
    // If the ID is not in the idMap, add it to the map and push the item to the result array
    if (!idMap[item.id]) {
      idMap[item.id] = true;
      result.push(item);
    }
  });

  return result;
}

export const getLeafNodes = (node: INode): INode[] => {
  // Nếu node không có children hoặc children rỗng, đây là node lá
  if (!node.children || node.children.length === 0) {
    return [node];
  }

  // Nếu node có children, tiếp tục đệ quy cho từng child
  let leafNodes: INode[] = [];
  for (const child of node.children) {
    leafNodes = leafNodes.concat(getLeafNodes(child));
  }

  return leafNodes;
};

export const getAllLeafNodes = (nodes: INode[]): INode[] => {
  let leafNodes: INode[] = [];
  for (const node of nodes) {
    leafNodes = leafNodes.concat(getLeafNodes(node));
  }
  return leafNodes;
};

export const flattenTree = (nodes: INode[]): INode[] => {
  const allNodes: INode[] = [];

  const traverse = (node: INode): void => {
    allNodes.push(node);
    if (node.children) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  };

  for (const node of nodes) {
    traverse(node);
  }

  return allNodes;
};

const buildNodeMap = (nodes: INode[], map: Map<string, INode>): void => {
  nodes.forEach((node) => {
    map.set(node.id, node);
    if (node.children) {
      buildNodeMap(node.children, map);
    }
  });
};

export const addParentNodesIfAllChildrenInSet = (nodes: INode[], fullData: INode[]): INode[] => {
  // Tạo một tập hợp chứa tất cả các id của các node trong danh sách đầu vào
  const nodeSet = new Set(nodes.map((node) => node.id));

  // Tạo một bản đồ id -> node từ fullData
  const fullDataMap = new Map<string, INode>();
  buildNodeMap(fullData, fullDataMap);

  // Hàm đệ quy để kiểm tra và thêm node cha nếu tất cả các node con của nó có trong nodeSet
  const addParentsRecursively = (node: INode): void => {
    if (node.parentId) {
      const parent = fullDataMap.get(node.parentId);
      if (parent) {
        // Kiểm tra nếu tất cả các con của parent đều trong nodeSet
        const allChildrenInSet = parent.children?.every((child) => nodeSet.has(child.id)) ?? true;
        if (allChildrenInSet && !nodeSet.has(parent.id)) {
          nodeSet.add(parent.id);
          addParentsRecursively(parent);
        }
      }
    }
  };

  // Hàm đệ quy để kiểm tra và loại bỏ node cha nếu không đủ tất cả các node con của nó
  const removeParentIfNotAllChildrenInSet = (node: INode): void => {
    if (node.children) {
      for (const child of node.children) {
        removeParentIfNotAllChildrenInSet(child);
      }
      const allChildrenInSet = node.children.every((child) => nodeSet.has(child.id));
      if (!allChildrenInSet) {
        nodeSet.delete(node.id);
      }
    }
  };

  // Duyệt qua các node trong danh sách đầu vào và kiểm tra node cha
  nodes.forEach((node) => {
    addParentsRecursively(node);
  });

  // Duyệt qua fullData để loại bỏ các node cha nếu không đủ tất cả các node con
  fullData.forEach((node) => {
    removeParentIfNotAllChildrenInSet(node);
  });

  // Tạo danh sách kết quả từ nodeSet
  const result = Array.from(nodeSet)
    .filter((id) => id !== "all")
    .map((id) => {
      const data = fullDataMap.get(id);
      if (data === undefined) {
        throw new Error(`Data not found for id: ${id}`);
      }
      return data;
    })
    .filter((node): node is INode => Boolean(node));

  return result;
};

export const findNodeById = (nodes: INode[], id: string): INode | undefined => {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
};
