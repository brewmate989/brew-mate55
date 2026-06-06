"use client";

import * as React from "react";

import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

// Theme Selector
const THEMES = {
  light: "",
  dark: ".dark",
};

const ChartContext =
  React.createContext(null);

function useChart() {

  const context =
    React.useContext(ChartContext);

  if (!context) {
    throw new Error(
      "useChart must be used within a <ChartContainer />"
    );
  }

  return context;
}

const ChartContainer =
  React.forwardRef(
    (
      {
        id,
        className,
        children,
        config,
        ...props
      },
      ref
    ) => {

      const uniqueId =
        React.useId();

      const chartId = `chart-${
        id ||
        uniqueId.replace(/:/g, "")
      }`;

      return (
        <ChartContext.Provider
          value={{ config }}
        >

          <div
            data-chart={chartId}
            ref={ref}
            className={cn(
              "flex aspect-video justify-center rounded-2xl border bg-white p-4 text-xs shadow-sm",
              "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
              "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50",
              "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
              "[&_.recharts-dot[stroke='#fff']]:stroke-transparent",
              "[&_.recharts-layer]:outline-none",
              "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border",
              "[&_.recharts-radial-bar-background-sector]:fill-muted",
              "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted",
              "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border",
              "[&_.recharts-sector[stroke='#fff']]:stroke-transparent",
              "[&_.recharts-sector]:outline-none",
              "[&_.recharts-surface]:outline-none",
              className
            )}
            {...props}
          >

            <ChartStyle
              id={chartId}
              config={config}
            />

            <RechartsPrimitive.ResponsiveContainer>
              {children}
            </RechartsPrimitive.ResponsiveContainer>

          </div>

        </ChartContext.Provider>
      );
    }
  );

ChartContainer.displayName =
  "ChartContainer";

const ChartStyle = ({
  id,
  config,
}) => {

  const colorConfig =
    Object.entries(config).filter(
      ([, config]) =>
        config.theme ||
        config.color
    );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html:
          Object.entries(THEMES)
            .map(
              ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[
        theme
      ] ||
      itemConfig.color;

    return color
      ? `--color-${key}: ${color};`
      : null;
  })
  .join("\n")}
}
`
            )
            .join("\n"),
      }}
    />
  );
};

const ChartTooltip =
  RechartsPrimitive.Tooltip;

const ChartTooltipContent =
  React.forwardRef(
    (
      {
        active,
        payload,
        className,
        indicator = "dot",
        hideLabel = false,
        hideIndicator = false,
        label,
        labelFormatter,
        labelClassName,
        formatter,
        color,
        nameKey,
        labelKey,
      },
      ref
    ) => {

      const { config } =
        useChart();

      const tooltipLabel =
        React.useMemo(() => {

          if (
            hideLabel ||
            !payload?.length
          ) {
            return null;
          }

          const [item] = payload;

          const key = `${
            labelKey ||
            item.dataKey ||
            item.name ||
            "value"
          }`;

          const itemConfig =
            getPayloadConfigFromPayload(
              config,
              item,
              key
            );

          const value =
            !labelKey &&
            typeof label ===
              "string"
              ? config[label]
                  ?.label || label
              : itemConfig?.label;

          if (labelFormatter) {
            return (
              <div
                className={cn(
                  "font-semibold text-orange-500",
                  labelClassName
                )}
              >
                {labelFormatter(
                  value,
                  payload
                )}
              </div>
            );
          }

          if (!value) {
            return null;
          }

          return (
            <div
              className={cn(
                "font-semibold text-orange-500",
                labelClassName
              )}
            >
              {value}
            </div>
          );

        }, [
          label,
          labelFormatter,
          payload,
          hideLabel,
          labelClassName,
          config,
          labelKey,
        ]);

      if (
        !active ||
        !payload?.length
      ) {
        return null;
      }

      const nestLabel =
        payload.length === 1 &&
        indicator !== "dot";

      return (
        <div
          ref={ref}
          className={cn(
            "grid min-w-[9rem] gap-2 rounded-xl border border-orange-100 bg-white px-3 py-2 text-xs shadow-xl",
            className
          )}
        >

          {!nestLabel
            ? tooltipLabel
            : null}

          <div className="grid gap-2">

            {payload.map(
              (item, index) => {

                const key = `${
                  nameKey ||
                  item.name ||
                  item.dataKey ||
                  "value"
                }`;

                const itemConfig =
                  getPayloadConfigFromPayload(
                    config,
                    item,
                    key
                  );

                const indicatorColor =
                  color ||
                  item.payload.fill ||
                  item.color;

                return (
                  <div
                    key={
                      item.dataKey
                    }
                    className={cn(
                      "flex items-center gap-2"
                    )}
                  >

                    {!hideIndicator && (
                      <div
                        className={cn({
                          "h-2.5 w-2.5 rounded-full":
                            indicator ===
                            "dot",
                          "w-1 h-4 rounded":
                            indicator ===
                            "line",
                        })}
                        style={{
                          backgroundColor:
                            indicatorColor,
                        }}
                      />
                    )}

                    <div className="flex flex-1 items-center justify-between">

                      <span className="text-muted-foreground">
                        {itemConfig?.label ||
                          item.name}
                      </span>

                      {item.value && (
                        <span className="font-mono font-semibold text-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      )}

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>
      );
    }
  );

ChartTooltipContent.displayName =
  "ChartTooltipContent";

const ChartLegend =
  RechartsPrimitive.Legend;

const ChartLegendContent =
  React.forwardRef(
    (
      {
        className,
        hideIcon = false,
        payload,
        verticalAlign = "bottom",
        nameKey,
      },
      ref
    ) => {

      const { config } =
        useChart();

      if (!payload?.length) {
        return null;
      }

      return (
        <div
          ref={ref}
          className={cn(
            "flex flex-wrap items-center justify-center gap-4 text-sm",
            verticalAlign ===
              "top"
              ? "pb-4"
              : "pt-4",
            className
          )}
        >

          {payload.map((item) => {

            const key = `${
              nameKey ||
              item.dataKey ||
              "value"
            }`;

            const itemConfig =
              getPayloadConfigFromPayload(
                config,
                item,
                key
              );

            return (
              <div
                key={item.value}
                className="flex items-center gap-2"
              >

                {itemConfig?.icon &&
                !hideIcon ? (
                  <itemConfig.icon />
                ) : (
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        item.color,
                    }}
                  />
                )}

                <span>
                  {itemConfig?.label}
                </span>

              </div>
            );
          })}

        </div>
      );
    }
  );

ChartLegendContent.displayName =
  "ChartLegendContent";

// Helper
function getPayloadConfigFromPayload(
  config,
  payload,
  key
) {

  if (
    typeof payload !== "object" ||
    payload === null
  ) {
    return undefined;
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload ===
      "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey = key;

  if (
    key in payload &&
    typeof payload[key] ===
      "string"
  ) {
    configLabelKey =
      payload[key];
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key] ===
      "string"
  ) {
    configLabelKey =
      payloadPayload[key];
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key];
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};