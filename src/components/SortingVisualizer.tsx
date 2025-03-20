import { useState, useCallback, useRef } from "react";
import {
  selectionSort,
  insertionSort,
  bubbleSort,
  quickSort,
  heapSort,
} from "../algorithms/sorting";

/**
 * Genera un array casuale di numeri da 1 a size
 * Usa l'algoritmo di Fisher-Yates per mescolare l'array in modo efficiente
 *
 * @param size Dimensione dell'array da generare
 * @returns Array mescolato di numeri da 1 a size
 */
const generateShuffledArray = (size: number) => {
  // Crea un array ordinato da 1 a size
  const array = Array.from({ length: size }, (_, i) => i + 1);

  // Implementazione dell'algoritmo Fisher-Yates per mescolare l'array
  for (let i = array.length - 1; i > 0; i--) {
    // Genera un indice casuale tra 0 e i
    const j = Math.floor(Math.random() * (i + 1));
    // Scambia gli elementi alle posizioni i e j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

/**
 * Componente principale che visualizza e gestisce gli algoritmi di ordinamento
 * Permette di selezionare diversi algoritmi e vedere la loro esecuzione animata
 */
export default function SortingVisualizer() {
  // Stato per l'array da ordinare, inizializzato con 500 elementi casuali
  const [array, setArray] = useState(() => generateShuffledArray(500));
  // Stato per tenere traccia se un ordinamento è in corso
  const [sorting, setSorting] = useState(false);
  // Stato per memorizzare l'algoritmo di ordinamento selezionato
  const [algorithm, setAlgorithm] = useState("");
  // Ref per controllare l'interruzione dell'algoritmo
  const stopSortingRef = useRef(false);

  /**
   * Gestisce l'avvio dell'algoritmo di ordinamento selezionato
   * Disabilita i controlli durante l'ordinamento e aggiorna l'UI
   */
  const handleSort = useCallback(async () => {
    // Previene l'avvio di più algoritmi contemporaneamente
    if (sorting) return;
    setSorting(true);
    // Resetta il flag di interruzione
    stopSortingRef.current = false;

    // Crea una copia dell'array per non modificare lo stato direttamente
    const arrCopy = [...array];

    // Esegue l'algoritmo di ordinamento selezionato
    switch (algorithm) {
      case "selection":
        await selectionSort(arrCopy, setArray, stopSortingRef);
        break;
      case "insertion":
        await insertionSort(arrCopy, setArray, stopSortingRef);
        break;
      case "bubble":
        await bubbleSort(arrCopy, setArray, stopSortingRef);
        break;
      case "quick":
        await quickSort(arrCopy, setArray, stopSortingRef);
        break;
      case "heap":
        await heapSort(arrCopy, setArray, stopSortingRef);
        break;
      default:
        break;
    }

    // Ripristina lo stato al termine dell'ordinamento
    setSorting(false);
  }, [array, sorting, algorithm]);

  /**
   * Interrompe l'esecuzione dell'algoritmo di ordinamento
   */
  const stopSorting = useCallback(() => {
    if (sorting) {
      stopSortingRef.current = true;
    }
  }, [sorting]);

  /**
   * Reimposta l'array con nuovi valori casuali
   * Disabilitato durante l'ordinamento
   */
  const resetArray = useCallback(() => {
    if (!sorting) {
      setArray(generateShuffledArray(500));
    }
  }, [sorting]);

  return (
    <section className="flex flex-col items-center justify-center h-screen">
      {/* Area di visualizzazione dell'array come barre verticali */}
      <div className="flex justify-center items-end p-4">
        {array.map((value, index) => (
          <div
            key={index}
            className="relative bg-black w-0.5 transition-all duration-100"
            style={{ height: `${value}px` }}
          >
            {/* Decorazione triangolare bianca in cima ad ogni barra */}
            <div
              className="absolute -top-0.5 left-0 size-1 bg-white border-none"
              style={{
                clipPath: "polygon(0 0, 200% 0, 0 100%)",
              }}
            />
          </div>
        ))}
      </div>

      {/* Controlli per selezionare l'algoritmo e avviare/resettare l'ordinamento */}
      <form className="flex gap-4 items-center">
        <label htmlFor="sorting">Choose Algorithm</label>
        <select
          id="sorting"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          className="border p-1"
          disabled={sorting}
        >
          <option value="">---</option>
          <option value="selection">Selection Sort</option>
          <option value="insertion">Insertion Sort</option>
          <option value="bubble">Bubble Sort</option>
          <option value="quick">Quick Sort</option>
          <option value="heap">Heap Sort</option>
        </select>

        {/* Pulsante per avviare l'ordinamento - disabilitato durante l'ordinamento o se non è stato selezionato un algoritmo */}
        <button
          type="button"
          className="px-6 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          onClick={handleSort}
          disabled={sorting || !algorithm}
        >
          Start
        </button>

        {/* Pulsante per interrompere l'ordinamento - abilitato solo quando l'ordinamento è in corso */}
        <button
          type="button"
          className="px-6 py-2 bg-yellow-500 text-white rounded disabled:opacity-50"
          onClick={stopSorting}
          disabled={!sorting}
        >
          Stop
        </button>

        {/* Pulsante per reimpostare l'array - disabilitato durante l'ordinamento */}
        <button
          type="reset"
          className="px-6 py-2 bg-red-500 text-white rounded disabled:opacity-50"
          onClick={resetArray}
          disabled={sorting}
        >
          Reset
        </button>
      </form>
    </section>
  );
}
