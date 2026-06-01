import * as React from 'react';

export type WeatherInfo = {
  temperature: number | null;
  wind: number | null;
  precipitation: number | null;
  label: string;
};

export function useWeather() {
  const [weather, setWeather] = React.useState<WeatherInfo>({
    temperature: null,
    wind: null,
    precipitation: null,
    label: 'Météo indisponible',
  });

  React.useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // Clisson, France
        const url = 'https://api.open-meteo.com/v1/forecast?latitude=47.0871&longitude=-1.2829&current=temperature_2m,precipitation,wind_speed_10m&timezone=Europe%2FParis';
        const response = await fetch(url);
        const data = await response.json();
        if (cancelled) return;
        const current = data.current || {};
        const precipitation = Number(current.precipitation ?? 0);
        setWeather({
          temperature: current.temperature_2m ?? null,
          wind: current.wind_speed_10m ?? null,
          precipitation,
          label: precipitation > 0.2 ? 'Pluie possible' : 'Sec / faible pluie',
        });
      } catch {
        if (!cancelled) setWeather({ temperature: null, wind: null, precipitation: null, label: 'Météo indisponible' });
      }
    }

    load();
    const id = window.setInterval(load, 30 * 60 * 1000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  return weather;
}
