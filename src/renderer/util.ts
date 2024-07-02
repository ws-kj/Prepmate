export const parseTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const mStr = mins < 10 ? "0" + mins.toString() : mins.toString();
  const sStr = secs < 10 ? "0" + secs.toString() : secs.toString();
  return mStr.toString() + ":" + sStr;
}

export function findLastIndex<T>(array: Array<T>, predicate: (value: T, index: number, obj: T[]) => boolean): number {
    let l = array.length;
    while (l--) {
        if (predicate(array[l], l, array))
            return l;
    }
    return -1;
}
