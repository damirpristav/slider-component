import { useRef, useState, useCallback, useEffect, useMemo } from 'react';

import { roundNumber, roundToN } from '../../helpers';

export const Slider = ({
  min = 0,
  max = 100,
  step = 1,
  marks,
  orientation = 'horizontal',
  defaultValue,
  onChange,
}: Props) => {
  const [isMoving, setIsMoving] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [value, setValue] = useState(min);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<HTMLDivElement | null>(null);
  const isHorizontal = useMemo(() => orientation === 'horizontal', [orientation]);

  // set default value and default progress if defaultValue prop is not undefined
  useEffect(() => {
    if (defaultValue && defaultValue >= min && defaultValue <= max) {
      setValue(defaultValue);
      setCurrentProgress(((defaultValue - min) / (max - min)) * 100);
    }
  }, [defaultValue, max, min]);

  // call onChange when value is changed
  useEffect(() => {
    onChange(value);
  }, [onChange, value]);

  const onMouseMove = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!isMoving || !handleRef.current || !progressRef.current) return;
      // mouse pointer position
      let position = 0;
      if (event instanceof MouseEvent) {
        position = isHorizontal ? event.clientX : event.clientY;
      }
      if (event instanceof TouchEvent) {
        position = isHorizontal ? event.touches[0].clientX : event.touches[0].clientY;
      }
      // size of slider
      const progressSize = isHorizontal ? progressRef.current.clientWidth : progressRef.current.clientHeight;
      const wrapperPosition = isHorizontal
        ? progressRef.current.getBoundingClientRect().left
        : progressRef.current.getBoundingClientRect().top;

      if (position >= wrapperPosition && position <= progressSize + wrapperPosition) {
        // one step in percentage
        const n = 100 / ((max - min) / step);
        let progressPercentage = ((position - wrapperPosition) / progressSize) * 100;
        if (!isHorizontal) {
          progressPercentage = 100 - progressPercentage;
        }
        const progress = roundToN(progressPercentage, n);
        setCurrentProgress(progress);
        setValue(roundNumber((progress / 100) * (max - min) + min));
      } else if (position < wrapperPosition) {
        setCurrentProgress(isHorizontal ? 0 : 100);
        setValue(isHorizontal ? min : max);
      } else if (position >= progressSize + wrapperPosition) {
        setCurrentProgress(isHorizontal ? 100 : 0);
        setValue(isHorizontal ? max : min);
      }
    },
    [isHorizontal, isMoving, max, min, step]
  );

  useEffect(() => {
    if (isMoving) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('touchmove', onMouseMove);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onMouseMove);
    };
  }, [isMoving, onMouseMove]);

  const onWindowMouseUp = useCallback(() => {
    setIsMoving(false);
  }, []);

  useEffect(() => {
    window.addEventListener('mouseup', onWindowMouseUp);
    window.addEventListener('touchend', onWindowMouseUp);
    return () => {
      window.removeEventListener('mouseup', onWindowMouseUp)
      window.removeEventListener('touchend', onWindowMouseUp)
    };
  }, [onWindowMouseUp]);

  const onSliderHandleMouseDown = () => {
    setIsMoving(true);
  };

  return (
    <div className="slider-wrapper">
      <div className={`slider ${isHorizontal ? 'horizontal' : 'vertical'}`}>
        <div className={`slider-progress ${isHorizontal ? 'horizontal' : 'vertical'}`} ref={progressRef}>
          <div
            className="slider-progress-inner"
            style={isHorizontal ? { width: `${currentProgress}%` } : { height: `${currentProgress}%` }}
          />
          {marks &&
            Array((max - min) / step + 1)
              .fill('')
              .map((_, index) => (
                <div
                  key={index}
                  className="slider-step"
                  style={
                    isHorizontal
                      ? { left: `${(step / (max - min)) * 100 * index}%` }
                      : { bottom: `${(step / (max - min)) * 100 * index}%` }
                  }
                />
              ))}
        </div>
        <div
          className={`slider-handle ${isHorizontal ? 'horizontal' : 'vertical'}`}
          onMouseDown={onSliderHandleMouseDown}
          onTouchStart={onSliderHandleMouseDown}
          ref={handleRef}
          style={isHorizontal ? { left: `${currentProgress}%` } : { bottom: `${currentProgress}%` }}
        >
          <div className="slider-handle-value-tooltip">{value}</div>
        </div>
      </div>
    </div>
  );
};

type Props = {
  defaultValue?: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  marks?: boolean;
  orientation?: 'horizontal' | 'vertical';
};
