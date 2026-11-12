import { useEffect, useState } from "react";
import { Observable } from "rxjs";

export function useObservable<T>(
  observableFactory: () => Observable<T>,
  deps: any[],
  initialValue: T,
): T {
  const [state, setState] = useState<T>(initialValue);

  useEffect(() => {
    const obs$ = observableFactory();
    const subscription = obs$.subscribe((value) => {
      setState(value);
    });

    // Cleanup subscription on unmount or when dependencies change
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
