import { FormEvent, useState } from 'react';

import { Slider, RangeSlider } from './components';

function App() {
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(0);
  const [value3, setValue3] = useState(0);
  const [value4, setValue4] = useState(0);
  const [value5, setValue5] = useState(0);
  const [rangeValue1Min, setRangeValue1Min] = useState(0);
  const [rangeValue1Max, setRangeValue1Max] = useState(0);
  const [rangeValue2Min, setRangeValue2Min] = useState(0);
  const [rangeValue2Max, setRangeValue2Max] = useState(0);
  const [rangeValue3Min, setRangeValue3Min] = useState(0);
  const [rangeValue3Max, setRangeValue3Max] = useState(0);
  const [rangeValue4Min, setRangeValue4Min] = useState(0);
  const [rangeValue4Max, setRangeValue4Max] = useState(0);

  const onRangeSlider1Change = (val1: number, val2: number) => {
    setRangeValue1Min(val1);
    setRangeValue1Max(val2);
  };

  const onRangeSlider2Change = (val1: number, val2: number) => {
    setRangeValue2Min(val1);
    setRangeValue2Max(val2);
  };

  const onRangeSlider3Change = (val1: number, val2: number) => {
    setRangeValue3Min(val1);
    setRangeValue3Max(val2);
  };

  const onRangeSlider4Change = (val1: number, val2: number) => {
    setRangeValue4Min(val1);
    setRangeValue4Max(val2);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('value 1: ', value1);
    console.log('value 2: ', value2);
    console.log('value 3: ', value3);
    console.log('value 4: ', value4);
    console.log('value 5: ', value5);
    console.log('range 1: ', rangeValue1Min, '-', rangeValue1Max);
    console.log('range 2: ', rangeValue2Min, '-', rangeValue2Max);
    console.log('range 3: ', rangeValue3Min, '-', rangeValue3Max);
    console.log('range 4: ', rangeValue4Min, '-', rangeValue4Max);
  };

  return (
    <main>
      <div className="container">
        <form onSubmit={onSubmit}>
          <div>
            <p>1. min: 0, max: 100, step: 1</p>
            <Slider onChange={(val) => setValue1(val)} />
          </div>
          <div>
            <p>2. min: 20, max: 60, step: 5</p>
            <Slider onChange={(val) => setValue2(val)} min={20} max={60} step={5} />
          </div>
          <div>
            <p>3. min: 100, max: 600, step: 50, with marks</p>
            <Slider onChange={(val) => setValue3(val)} min={100} max={600} step={50} marks />
          </div>
          <div>
            <p>4. min: 0, max: 100, step: 1, with default value 67</p>
            <Slider onChange={(val) => setValue4(val)} defaultValue={67} />
          </div>
          <div>
            <p>5. min: 0, max: 100, step: 1, orientation vertical</p>
            <Slider onChange={(val) => setValue5(val)} orientation="vertical" />
          </div>
          <div>
            <p>Range 1. min: 0, max: 100, step: 1</p>
            <RangeSlider onChange={onRangeSlider1Change} />
          </div>
          <div>
            <p>Range 2. min: 20, max: 60, step: 2</p>
            <RangeSlider onChange={onRangeSlider2Change} min={20} max={60} step={2} />
          </div>
          <div>
            <p>Range 3. min: 50, max: 450, step: 25, with default value min 150 and default value max 350</p>
            <RangeSlider
              onChange={onRangeSlider3Change}
              min={50}
              max={450}
              step={25}
              defaultValueMin={150}
              defaultValueMax={350}
            />
          </div>
          <div>
            <p>Range 4. min: 0, max: 100, step: 1, orientation vertical, default min 23, default max 78</p>
            <RangeSlider
              onChange={onRangeSlider4Change}
              orientation="vertical"
              defaultValueMin={23}
              defaultValueMax={78}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </main>
  );
}

export default App;
