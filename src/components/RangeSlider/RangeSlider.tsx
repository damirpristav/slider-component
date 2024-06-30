import { useRef, useState, useCallback, useEffect, useMemo } from 'react';

import { roundNumber, roundToN } from '../../helpers';

export const RangeSlider = ({
  min = 0,
  max = 100,
  step = 1,
  marks,
  orientation = 'horizontal',
  defaultValueMax,
  defaultValueMin,
  onChange,
}: Props) => {
  const [isMoving, setIsMoving] = useState(false);
  const [isRangeMaxMoving, setIsRangeMaxMoving] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentProgressRangeMax, setCurrentProgressRangeMax] = useState((step / (max - min)) * 100);
  const [value, setValue] = useState(min);
  const [valueRangeMax, setValueRangeMax] = useState(min + step);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<HTMLDivElement | null>(null);
  const handleRangeMaxRef = useRef<HTMLDivElement | null>(null);
  const isHorizontal = useMemo(() => orientation === 'horizontal', [orientation]);

  // set default values and default progress if defaultValue props is not undefined
  useEffect(() => {
    if (defaultValueMin && defaultValueMax && defaultValueMax > defaultValueMin && defaultValueMin >= min && defaultValueMax <= max) {
      setValue(defaultValueMin);
      setCurrentProgress(((defaultValueMin - min) / (max - min)) * 100);
      setValueRangeMax(defaultValueMax);
      setCurrentProgressRangeMax(((defaultValueMax - min) / (max - min)) * 100);
    }
  }, [defaultValueMax, defaultValueMin, max, min]);

  // call onChange when value is changed
  useEffect(() => {
    onChange(value, valueRangeMax);
  }, [onChange, value, valueRangeMax]);

  const onMouseMove = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if ((!isMoving && !isRangeMaxMoving) || !progressRef.current) return;
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

      // one step in percentage
      const n = 100 / ((max - min) / step);
      let progressPercentage = ((position - wrapperPosition) / progressSize) * 100;
      if (!isHorizontal) {
        progressPercentage = 100 - progressPercentage;
      }
      const progress = roundToN(progressPercentage, n);
      const minStepProgress = roundNumber((step / (max - min)) * 100);
      const currValue = roundNumber((currentProgress / 100) * (max - min) + min);
      const currValueRangeMax = roundNumber((currentProgressRangeMax / 100) * (max - min) + min);

      if (position >= wrapperPosition && position <= progressSize + wrapperPosition) {
        if (isMoving && progress !== 100) {
          setCurrentProgress(progress);
          setValue(roundNumber((progress / 100) * (max - min) + min));
          if (currValue >= currValueRangeMax && currValueRangeMax !== max) {
            setCurrentProgressRangeMax(progress + minStepProgress);
            setValueRangeMax(currValue + step);
          }
        }
        if (isRangeMaxMoving && progress !== 0) {
          setCurrentProgressRangeMax(progress);
          setValueRangeMax(roundNumber((progress / 100) * (max - min) + min));
          if (currValue >= currValueRangeMax && currValue !== min) {
            setCurrentProgress(progress - minStepProgress);
            setValue(currValue - step);
          }
        }
      } else if (position < wrapperPosition) {
        if (isMoving) {
          setCurrentProgress(isHorizontal ? 0 : 100 - minStepProgress);
          setValue(isHorizontal ? min : max - step);
          if (!isHorizontal) {
            setCurrentProgressRangeMax(100);
            setValueRangeMax(max);
          }
        }
        if (isRangeMaxMoving) {
          setCurrentProgressRangeMax(isHorizontal ? minStepProgress : 100);
          setValueRangeMax(isHorizontal ? step : max);
          if (isHorizontal) {
            setCurrentProgress(0);
            setValue(min);
          }
        }
      } else if (position >= progressSize + wrapperPosition) {
        if (isMoving) {
          setCurrentProgress(isHorizontal ? 100 - minStepProgress : 0);
          setValue(isHorizontal ? max - step : min);
          if (isHorizontal) {
            setCurrentProgressRangeMax(100);
            setValueRangeMax(max);
          }
        }
        if (isRangeMaxMoving) {
          setCurrentProgressRangeMax(isHorizontal ? 100 : minStepProgress);
          setValueRangeMax(isHorizontal ? max : step);
          if (!isHorizontal) {
            setCurrentProgress(0);
            setValue(min);
          }
        }
      }
    },
    [currentProgress, currentProgressRangeMax, isHorizontal, isMoving, isRangeMaxMoving, max, min, step]
  );

  useEffect(() => {
    if (isMoving || isRangeMaxMoving) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('touchmove', onMouseMove);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onMouseMove);
    };
  }, [isMoving, isRangeMaxMoving, onMouseMove]);

  const onWindowMouseUp = useCallback(() => {
    setIsMoving(false);
    setIsRangeMaxMoving(false);
  }, []);

  useEffect(() => {
    window.addEventListener('mouseup', onWindowMouseUp);
    window.addEventListener('touchend', onWindowMouseUp);
    return () => {
      window.removeEventListener('mouseup', onWindowMouseUp);
      window.removeEventListener('touchend', onWindowMouseUp);
    };
  }, [onWindowMouseUp]);

  const onSliderHandleMouseDown = () => {
    setIsMoving(true);
  };

  const onSliderHandleRangeMaxMouseDown = () => {
    setIsRangeMaxMoving(true);
  };

  return (
    <div className="slider-wrapper">
      <div className={`slider ${isHorizontal ? 'horizontal' : 'vertical'}`}>
        <div className={`slider-progress ${isHorizontal ? 'horizontal' : 'vertical'}`} ref={progressRef}>
          <div
            className="slider-progress-inner"
            style={
              isHorizontal
                ? { width: `${currentProgressRangeMax - currentProgress}%`, left: `${currentProgress}%` }
                : { height: `${currentProgressRangeMax - currentProgress}%`, bottom: `${currentProgress}%` }
            }
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
        <div
          className={`slider-handle slider-handle-range ${isHorizontal ? 'horizontal' : 'vertical'}`}
          onMouseDown={onSliderHandleRangeMaxMouseDown}
          onTouchStart={onSliderHandleRangeMaxMouseDown}
          ref={handleRangeMaxRef}
          style={isHorizontal ? { left: `${currentProgressRangeMax}%` } : { bottom: `${currentProgressRangeMax}%` }}
        >
          <div className="slider-handle-value-tooltip">{valueRangeMax}</div>
        </div>
      </div>
    </div>
  );
};

type Props = {
  defaultValueMin?: number;
  defaultValueMax?: number;
  onChange: (valueMin: number, valueMax: number) => void;
  min?: number;
  max?: number;
  step?: number;
  marks?: boolean;
  orientation?: 'horizontal' | 'vertical';
};
