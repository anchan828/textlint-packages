/* eslint-disable */
import * as fs from "fs";
import * as glob from "glob";
import * as path from "path";

interface CoverageProperty {
  total: number;
  covered: number;
  skipped: number;
  pct: number;
}
type CoveragePropertyType = keyof CoverageProperty;
interface TotalProperty {
  lines: CoverageProperty;
  functions: CoverageProperty;
  statements: CoverageProperty;
  branches: CoverageProperty;
}

class JsonSummary {
  constructor(filePath?: string) {
    if (filePath) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      this.data = data;
    }
  }

  public data: {
    total: TotalProperty;
    [filePath: string]: TotalProperty;
  } = {
    total: {
      branches: {
        covered: 0,
        pct: 0,
        skipped: 0,
        total: 0,
      },
      functions: {
        covered: 0,
        pct: 0,
        skipped: 0,
        total: 0,
      },
      lines: {
        covered: 0,
        pct: 0,
        skipped: 0,
        total: 0,
      },
      statements: {
        covered: 0,
        pct: 0,
        skipped: 0,
        total: 0,
      },
    },
  };

  public merge(filePath: string) {
    const { data } = new JsonSummary(filePath);

    if (data.total) {
      this.data.total = this.mergeTotalProperty(this.data.total, data.total);
    }

    const fileCoverageKeys = Object.keys(data).filter(key => key !== "total");

    for (const fileCoverageKey of fileCoverageKeys) {
      this.data[fileCoverageKey] = data[fileCoverageKey];
    }
  }

  public write(dist: string) {
    if (!fs.existsSync(path.dirname(dist))) {
      fs.mkdirSync(path.dirname(dist));
    }

    fs.writeFileSync(dist, JSON.stringify(this.data));
  }

  private mergeTotalProperty(left: TotalProperty, right: TotalProperty): TotalProperty {
    const coveragePropertyKeys = Object.keys(left).map((key: string) => key as CoveragePropertyType);

    coveragePropertyKeys.forEach((coveragePropertyType: CoveragePropertyType) => {
      left[coveragePropertyType] = this.mergeCoverageProperty(left[coveragePropertyType], right[coveragePropertyType]);
    });
    return left;
  }

  private mergeCoverageProperty(left: CoverageProperty, right: CoverageProperty): CoverageProperty {
    Object.keys(left).forEach((coveragePropertyType: CoveragePropertyType) => {
      if (typeof right[coveragePropertyType] === "number") {
        if (coveragePropertyType !== "pct") {
          left[coveragePropertyType] += right[coveragePropertyType];
        }
      }
    });

    left.pct = this.calcPercent(left);

    return left;
  }

  private calcPercent(coverageProperty: CoverageProperty): number {
    if (coverageProperty.total > 0) {
      return Math.floor(((1000 * 100 * coverageProperty.covered) / coverageProperty.total + 5) / 10) / 100;
    } else {
      return 100.0;
    }
  }
}

class Lcov {
  data: string[] = [];

  constructor(filePath?: string) {
    if (filePath) {
      this.read(filePath);
    }
  }

  private read(filePath: string) {
    if (!fs.existsSync(filePath)) {
      return;
    }
    const text = fs.readFileSync(filePath, "utf8");
    const packageRoot = path.relative(process.cwd(), filePath).replace("/coverage/lcov.info", "");
    this.data.push(text.replace(/^SF:src/gm, `SF:${packageRoot}/src`));
  }

  public merge(filePath: string) {
    this.read(filePath);
  }

  public write(dist: string) {
    if (!fs.existsSync(path.dirname(dist))) {
      fs.mkdirSync(path.dirname(dist));
    }

    fs.writeFileSync(dist, this.data.filter(d => d).join("\n"));
  }
}

const summaryFiles = glob.sync(path.resolve(__dirname, "../packages/*/coverage/coverage-summary.json"));
const lcovFiles = glob.sync(path.resolve(__dirname, "../packages/*/coverage/lcov.info"));

const jsonSummary = new JsonSummary();
const lcov = new Lcov();

for (const file of summaryFiles) {
  jsonSummary.merge(file);
}

for (const lcovFile of lcovFiles) {
  lcov.merge(lcovFile);
}

jsonSummary.write(path.resolve(__dirname, "../coverage/coverage-summary.json"));
lcov.write(path.resolve(__dirname, "../coverage/lcov.info"));
