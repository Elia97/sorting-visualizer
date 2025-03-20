// -------------------- SELECTION SORT --------------------

export const selectionSort = async (
  array: number[],
  updateArray: (newArray: number[]) => void,
  stopRef: React.RefObject<boolean>,
  delay = 10
) => {
  const arr = [...array];
  for (let i = arr.length - 1; i >= 0; i--) {
    if (stopRef.current) return;

    let max = i;
    for (let j = i - 1; j >= 0; j--) {
      if (arr[j] > arr[max]) max = j;
    }
    if (max !== i) [arr[i], arr[max]] = [arr[max], arr[i]];

    if (i % 1 === 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      updateArray([...arr]);
    }
  }
  updateArray(arr);
};

// -------------------- INSERTION SORT --------------------

export const insertionSort = async (
  array: number[],
  updateArray: (newArray: number[]) => void,
  stopRef: React.RefObject<boolean>,
  delay = 10
) => {
  const arr = [...array];
  for (let i = 1; i < arr.length; i++) {
    if (stopRef.current) return;

    let j = i;
    while (j > 0 && arr[j] < arr[j - 1]) {
      [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
      j--;
    }

    if (i % 1 === 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      updateArray([...arr]);
    }
  }
  updateArray(arr);
};

// -------------------- BUBBLE SORT --------------------

export const bubbleSort = async (
  array: number[],
  updateArray: (newArray: number[]) => void,
  stopRef: React.RefObject<boolean>,
  delay = 1
) => {
  const arr = [...array];
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (stopRef.current) return;

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }

      if (j % 1 === 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        updateArray([...arr]);
      }
    }
  }
  updateArray(arr);
};

// -------------------- QUICK SORT --------------------

export const quickSort = async (
  array: number[],
  updateArray: (newArray: number[]) => void,
  stopRef: React.RefObject<boolean>,
  delay = 10
) => {
  const partition = (arr: number[], low: number, high: number): number => {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
  };

  const quickSortRecursive = async (
    arr: number[],
    low: number,
    high: number
  ) => {
    if (stopRef.current) return;

    if (low < high) {
      const pivotIndex = partition(arr, low, high);

      await quickSortRecursive(arr, low, pivotIndex - 1);
      await quickSortRecursive(arr, pivotIndex + 1, high);

      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          updateArray([...arr]);
          setTimeout(resolve, delay);
        });
      });
    }
  };

  const arr = [...array];
  await quickSortRecursive(arr, 0, arr.length - 1);
  updateArray(arr);
};

// -------------------- HEAP SORT --------------------

export const heapSort = async (
  array: number[],
  updateArray: (newArray: number[]) => void,
  stopRef: React.RefObject<boolean>,
  delay = 10
) => {
  const heapify = (arr: number[], n: number, i: number) => {
    if (stopRef.current) return;

    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]]; // Swap
      heapify(arr, n, largest);
    }
  };

  const arr = [...array];
  const n = arr.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    if (stopRef.current) return;

    heapify(arr, n, i);

    if (i % 1 === 0) {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          updateArray([...arr]);
          setTimeout(resolve, delay / 2);
        });
      });
    }
  }

  for (let i = n - 1; i > 0; i--) {
    if (stopRef.current) return;

    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        updateArray([...arr]);
        setTimeout(resolve, delay);
      });
    });
  }

  if (!stopRef.current) {
    updateArray(arr);
  }
};
