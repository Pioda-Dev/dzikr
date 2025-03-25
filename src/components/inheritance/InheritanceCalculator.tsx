import { useState, useEffect } from "react";
import {
  Calculator,
  X,
  Plus,
  Trash2,
  HelpCircle,
  Info,
  Settings,
} from "lucide-react";
import { t, getCurrentLanguage } from "../../lib/i18n";
import { formatCurrency } from "../../lib/wallet";
import SettingsModal from "../settings/SettingsModal";

type Heir = {
  id: number;
  relationship: string;
  gender: "male" | "female";
  count: number;
  isBlocked?: boolean;
};

type InheritanceShare = {
  relationship: string;
  share: string;
  percentage: number;
  explanation: string;
  isBlocked?: boolean;
};

interface InheritanceCalculatorProps {
  onClose: () => void;
}

const InheritanceCalculator = ({ onClose }: InheritanceCalculatorProps) => {
  const currentLang = getCurrentLanguage();
  const [estateValue, setEstateValue] = useState<number>(0);
  const [heirs, setHeirs] = useState<Heir[]>([
    { id: 1, relationship: "son", gender: "male", count: 1 },
  ]);
  const [results, setResults] = useState<InheritanceShare[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [currency, setCurrency] = useState<string>(
    localStorage.getItem("currency") || "IDR",
  );

  useEffect(() => {
    // Listen for currency changes
    const handleStorageChange = () => {
      setCurrency(localStorage.getItem("currency") || "IDR");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const relationshipOptions = [
    { value: "husband", label: currentLang === "id" ? "Suami" : "Husband" },
    { value: "wife", label: currentLang === "id" ? "Istri" : "Wife" },
    { value: "son", label: currentLang === "id" ? "Anak Laki-laki" : "Son" },
    {
      value: "daughter",
      label: currentLang === "id" ? "Anak Perempuan" : "Daughter",
    },
    { value: "father", label: currentLang === "id" ? "Ayah" : "Father" },
    { value: "mother", label: currentLang === "id" ? "Ibu" : "Mother" },
    {
      value: "grandfather",
      label:
        currentLang === "id"
          ? "Kakek (Ayah dari Ayah)"
          : "Paternal Grandfather",
    },
    {
      value: "grandmother",
      label: currentLang === "id" ? "Nenek" : "Grandmother",
    },
    {
      value: "brother",
      label:
        currentLang === "id" ? "Saudara Laki-laki Kandung" : "Full Brother",
    },
    {
      value: "sister",
      label: currentLang === "id" ? "Saudara Perempuan Kandung" : "Full Sister",
    },
    {
      value: "paternal_brother",
      label:
        currentLang === "id" ? "Saudara Laki-laki Seayah" : "Paternal Brother",
    },
    {
      value: "paternal_sister",
      label:
        currentLang === "id" ? "Saudara Perempuan Seayah" : "Paternal Sister",
    },
    {
      value: "maternal_brother",
      label:
        currentLang === "id" ? "Saudara Laki-laki Seibu" : "Maternal Brother",
    },
    {
      value: "maternal_sister",
      label:
        currentLang === "id" ? "Saudara Perempuan Seibu" : "Maternal Sister",
    },
    {
      value: "grandson",
      label:
        currentLang === "id"
          ? "Cucu Laki-laki dari Anak Laki-laki"
          : "Son's Son",
    },
    {
      value: "granddaughter",
      label:
        currentLang === "id"
          ? "Cucu Perempuan dari Anak Laki-laki"
          : "Son's Daughter",
    },
    {
      value: "nephew",
      label:
        currentLang === "id"
          ? "Anak Laki-laki dari Saudara Laki-laki"
          : "Brother's Son",
    },
    {
      value: "niece",
      label:
        currentLang === "id"
          ? "Anak Perempuan dari Saudara Laki-laki"
          : "Brother's Daughter",
    },
    {
      value: "uncle",
      label:
        currentLang === "id"
          ? "Paman (Saudara Laki-laki Ayah)"
          : "Paternal Uncle",
    },
    {
      value: "aunt",
      label:
        currentLang === "id"
          ? "Bibi (Saudara Perempuan Ayah)"
          : "Paternal Aunt",
    },
    {
      value: "cousin",
      label:
        currentLang === "id"
          ? "Sepupu (Anak Laki-laki Paman)"
          : "Paternal Uncle's Son",
    },
  ];

  const addHeir = () => {
    const newId =
      heirs.length > 0 ? Math.max(...heirs.map((h) => h.id)) + 1 : 1;
    setHeirs([
      ...heirs,
      { id: newId, relationship: "son", gender: "male", count: 1 },
    ]);
  };

  const removeHeir = (id: number) => {
    if (heirs.length > 1) {
      setHeirs(heirs.filter((heir) => heir.id !== id));
    }
  };

  const updateHeir = (id: number, field: keyof Heir, value: any) => {
    setHeirs(
      heirs.map((heir) => {
        if (heir.id === id) {
          return { ...heir, [field]: value };
        }
        return heir;
      }),
    );
  };

  const calculateInheritance = () => {
    // This is a more detailed implementation of Islamic inheritance law
    // based on the rules from justika.com/partner/cariustadz?service=kalkulator-waris
    const shares: InheritanceShare[] = [];

    // Check for spouse
    const husband = heirs.find((h) => h.relationship === "husband");
    const wife = heirs.find((h) => h.relationship === "wife");
    const wivesCount = wife ? wife.count : 0;

    // Check for children and descendants
    const sons = heirs
      .filter((h) => h.relationship === "son")
      .reduce((sum, h) => sum + h.count, 0);
    const daughters = heirs
      .filter((h) => h.relationship === "daughter")
      .reduce((sum, h) => sum + h.count, 0);
    const grandsons = heirs
      .filter((h) => h.relationship === "grandson")
      .reduce((sum, h) => sum + h.count, 0);
    const granddaughters = heirs
      .filter((h) => h.relationship === "granddaughter")
      .reduce((sum, h) => sum + h.count, 0);

    // Check for parents and grandparents
    const father = heirs.find((h) => h.relationship === "father");
    const mother = heirs.find((h) => h.relationship === "mother");
    const grandfather = heirs.find((h) => h.relationship === "grandfather");
    const grandmother = heirs.find((h) => h.relationship === "grandmother");

    // Check for siblings
    const fullBrothers = heirs
      .filter((h) => h.relationship === "brother")
      .reduce((sum, h) => sum + h.count, 0);
    const fullSisters = heirs
      .filter((h) => h.relationship === "sister")
      .reduce((sum, h) => sum + h.count, 0);
    const paternalBrothers = heirs
      .filter((h) => h.relationship === "paternal_brother")
      .reduce((sum, h) => sum + h.count, 0);
    const paternalSisters = heirs
      .filter((h) => h.relationship === "paternal_sister")
      .reduce((sum, h) => sum + h.count, 0);
    const maternalBrothers = heirs
      .filter((h) => h.relationship === "maternal_brother")
      .reduce((sum, h) => sum + h.count, 0);
    const maternalSisters = heirs
      .filter((h) => h.relationship === "maternal_sister")
      .reduce((sum, h) => sum + h.count, 0);

    // Check for other relatives
    const nephews = heirs
      .filter((h) => h.relationship === "nephew")
      .reduce((sum, h) => sum + h.count, 0);
    const uncles = heirs
      .filter((h) => h.relationship === "uncle")
      .reduce((sum, h) => sum + h.count, 0);
    const cousins = heirs
      .filter((h) => h.relationship === "cousin")
      .reduce((sum, h) => sum + h.count, 0);

    // Determine if there are any direct descendants
    const hasDirectDescendants = sons > 0 || daughters > 0;
    // Determine if there are any male descendants
    const hasMaleDescendants = sons > 0 || grandsons > 0;
    // Determine if there are any descendants at all
    const hasAnyDescendants =
      hasDirectDescendants || grandsons > 0 || granddaughters > 0;

    // Determine if there are any siblings
    const hasSiblings =
      fullBrothers > 0 ||
      fullSisters > 0 ||
      paternalBrothers > 0 ||
      paternalSisters > 0 ||
      maternalBrothers > 0 ||
      maternalSisters > 0;

    // Total maternal siblings
    const totalMaternalSiblings = maternalBrothers + maternalSisters;

    let remainingShare = 1; // Start with 100% of the estate

    // Apply hijab (blocking) rules
    // Sons block grandsons and granddaughters
    let grandsonBlocked = sons > 0;
    let granddaughterBlocked = sons > 0 || (daughters >= 2 && grandsons === 0);

    // Father blocks grandfather and all brothers/sisters
    let grandfatherBlocked = father !== undefined;
    let siblingsBlockedByFather = father !== undefined;

    // Sons or father block brothers and sisters
    let siblingsBlocked = hasMaleDescendants || father !== undefined;

    // Direct descendants block nephews, uncles, and cousins
    let otherRelativesBlocked =
      hasAnyDescendants ||
      father !== undefined ||
      grandfather !== undefined ||
      fullBrothers > 0 ||
      paternalBrothers > 0;

    // Allocate shares according to Islamic law
    if (husband) {
      const husbandShare = hasAnyDescendants ? 1 / 4 : 1 / 2;
      shares.push({
        relationship: "Husband",
        share: hasAnyDescendants ? "1/4" : "1/2",
        percentage: husbandShare * 100,
        explanation: hasAnyDescendants
          ? "Husband gets 1/4 when there are children or grandchildren"
          : "Husband gets 1/2 when there are no children or grandchildren",
      });
      remainingShare -= husbandShare;
    }

    if (wife) {
      const wifeShare = hasAnyDescendants ? 1 / 8 : 1 / 4;
      // If multiple wives, they share the wife's portion equally
      const individualWifeShare = wifeShare / wivesCount;

      shares.push({
        relationship: `Wife${wivesCount > 1 ? " (" + wivesCount + " wives share equally)" : ""}`,
        share: hasAnyDescendants ? "1/8" : "1/4",
        percentage: wifeShare * 100,
        explanation: hasAnyDescendants
          ? `Wife gets 1/8 when there are children or grandchildren${wivesCount > 1 ? ". Multiple wives share this portion equally" : ""}`
          : `Wife gets 1/4 when there are no children or grandchildren${wivesCount > 1 ? ". Multiple wives share this portion equally" : ""}`,
      });
      remainingShare -= wifeShare;
    }

    if (father) {
      // Father gets 1/6 fixed share when there are male descendants
      // Plus residue when there are no male descendants
      let fatherShare = 1 / 6;
      let fatherExplanation =
        "Father gets 1/6 fixed share when there are male descendants";

      if (!hasMaleDescendants) {
        // If no male descendants, father gets 1/6 plus residue
        if (hasDirectDescendants) {
          fatherExplanation =
            "Father gets 1/6 fixed share plus residue when there are only daughters";
        } else {
          // If no descendants at all, father gets all residue
          fatherShare = remainingShare;
          fatherExplanation =
            "Father gets all remaining estate when there are no descendants";
        }
      }

      shares.push({
        relationship: "Father",
        share: hasMaleDescendants
          ? "1/6"
          : hasDirectDescendants
            ? "1/6 + Residue"
            : "Residue",
        percentage: fatherShare * 100,
        explanation: fatherExplanation,
      });
      remainingShare -= fatherShare;
    }

    if (mother) {
      let motherShare = 1 / 6;
      let motherExplanation =
        "Mother gets 1/6 when there are children or multiple siblings";

      if (
        !hasAnyDescendants &&
        (totalMaternalSiblings < 2 || siblingsBlocked)
      ) {
        // If no descendants and fewer than 2 siblings (or siblings are blocked), mother gets 1/3
        motherShare = 1 / 3;
        motherExplanation =
          "Mother gets 1/3 when there are no children and fewer than 2 siblings";
      }

      // Special case: if only heirs are husband/wife, mother, and father
      const onlySpouseAndParents =
        (husband || wife) &&
        mother &&
        father &&
        !hasAnyDescendants &&
        !hasSiblings;

      if (onlySpouseAndParents) {
        // Mother gets 1/3 of the remainder after spouse's share
        const spouseShare = husband ? 1 / 2 : 1 / 4;
        motherShare = (1 - spouseShare) / 3;
        motherExplanation =
          "Mother gets 1/3 of remainder after spouse's share when only heirs are spouse and parents";
      }

      shares.push({
        relationship: "Mother",
        share:
          motherShare === 1 / 6
            ? "1/6"
            : onlySpouseAndParents
              ? "1/3 of remainder"
              : "1/3",
        percentage: motherShare * 100,
        explanation: motherExplanation,
      });
      remainingShare -= motherShare;
    }

    if (grandfather && !grandfatherBlocked) {
      // Grandfather takes father's place when father is not present
      let grandfatherShare = 1 / 6;
      let grandfatherExplanation =
        "Grandfather gets 1/6 fixed share when there are male descendants";

      if (!hasMaleDescendants) {
        if (hasDirectDescendants) {
          grandfatherExplanation =
            "Grandfather gets 1/6 fixed share plus residue when there are only daughters";
        } else {
          grandfatherShare = remainingShare;
          grandfatherExplanation =
            "Grandfather gets all remaining estate when there are no descendants";
        }
      }

      shares.push({
        relationship: "Paternal Grandfather",
        share: hasMaleDescendants
          ? "1/6"
          : hasDirectDescendants
            ? "1/6 + Residue"
            : "Residue",
        percentage: grandfatherShare * 100,
        explanation: grandfatherExplanation,
        isBlocked: grandfatherBlocked,
      });

      if (!grandfatherBlocked) {
        remainingShare -= grandfatherShare;
      }
    }

    if (grandmother && !mother) {
      // Grandmother gets share only if mother is not present
      const grandmotherShare = 1 / 6;
      shares.push({
        relationship: "Grandmother",
        share: "1/6",
        percentage: grandmotherShare * 100,
        explanation: "Grandmother gets 1/6 when mother is not present",
        isBlocked: mother !== undefined,
      });

      if (!mother) {
        remainingShare -= grandmotherShare;
      }
    }

    // Distribute to sons and daughters
    if (sons > 0 || daughters > 0) {
      const totalShares = sons * 2 + daughters; // Sons get twice the share of daughters

      if (sons > 0) {
        const sonShare = (remainingShare * (sons * 2)) / totalShares;
        shares.push({
          relationship: `Son${sons > 1 ? "s" : ""}`,
          share: `${sons * 2}/${totalShares} of residue`,
          percentage: sonShare * 100,
          explanation: `Son${sons > 1 ? "s" : ""} get twice the share of daughters from the remaining estate`,
        });
      }

      if (daughters > 0) {
        const daughterShare = (remainingShare * daughters) / totalShares;
        shares.push({
          relationship: `Daughter${daughters > 1 ? "s" : ""}`,
          share: `${daughters}/${totalShares} of residue`,
          percentage: daughterShare * 100,
          explanation: `Daughter${daughters > 1 ? "s" : ""} get half the share of sons from the remaining estate`,
        });
      }
    }

    // Set the results
    setResults(shares);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-emerald-700 text-white">
          <h2 className="text-lg font-semibold flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            {t("inheritance.title")}
          </h2>
          <div className="flex items-center">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 rounded-full hover:bg-emerald-600 transition-colors mr-2"
              title={t("settings.title")}
            >
              <Settings className="h-5 w-5 text-white" />
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-emerald-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t("inheritance.estateValue")}
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={estateValue}
                  onChange={(e) => setEstateValue(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  min="0"
                  step="1000"
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-medium text-slate-700">
                  {t("inheritance.heirs")}
                </h3>
                <button
                  onClick={addHeir}
                  className="p-1 bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                {heirs.map((heir) => (
                  <div
                    key={heir.id}
                    className="p-3 bg-slate-50 rounded-md border border-slate-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <select
                          value={heir.relationship}
                          onChange={(e) =>
                            updateHeir(heir.id, "relationship", e.target.value)
                          }
                          className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-2"
                        >
                          {relationshipOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>

                        <div className="flex items-center space-x-2">
                          <div className="flex-1">
                            <label className="block text-xs text-slate-500 mb-1">
                              {t("inheritance.gender")}
                            </label>
                            <select
                              value={heir.gender}
                              onChange={(e) =>
                                updateHeir(
                                  heir.id,
                                  "gender",
                                  e.target.value as "male" | "female",
                                )
                              }
                              className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                              <option value="male">
                                {currentLang === "id" ? "Laki-laki" : "Male"}
                              </option>
                              <option value="female">
                                {currentLang === "id" ? "Perempuan" : "Female"}
                              </option>
                            </select>
                          </div>

                          <div className="flex-1">
                            <label className="block text-xs text-slate-500 mb-1">
                              {t("inheritance.count")}
                            </label>
                            <input
                              type="number"
                              value={heir.count}
                              onChange={(e) =>
                                updateHeir(
                                  heir.id,
                                  "count",
                                  Math.max(1, parseInt(e.target.value) || 1),
                                )
                              }
                              className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              min="1"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => removeHeir(heir.id)}
                        className="p-1 text-slate-400 hover:text-red-500"
                        disabled={heirs.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={calculateInheritance}
              className="w-full py-2 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center justify-center"
            >
              <Calculator className="h-4 w-4 mr-2" />
              {t("inheritance.calculate")}
            </button>
          </div>

          {results.length > 0 && (
            <div className="p-4 border-t border-slate-200">
              <h3 className="text-lg font-medium text-slate-800 mb-4">
                {t("inheritance.shares")}
              </h3>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                      >
                        {t("inheritance.heir")}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                      >
                        {t("inheritance.share")}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                      >
                        %
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                      >
                        {t("inheritance.amount")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {results
                      .filter((result) => !result.isBlocked)
                      .map((result, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                            {result.relationship}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {result.share}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {result.percentage.toFixed(2)}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {formatCurrency(
                              (estateValue * result.percentage) / 100,
                              currency,
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6">
                <h4 className="text-md font-medium text-slate-800 mb-2 flex items-center">
                  <Info className="h-4 w-4 mr-2 text-emerald-600" />
                  {t("inheritance.explanations")}
                </h4>
                <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
                    {results
                      .filter((result) => !result.isBlocked)
                      .map((result, index) => (
                        <li key={index}>{result.explanation}</li>
                      ))}
                  </ul>
                </div>
              </div>

              {results.some((result) => result.isBlocked) && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowHelp(!showHelp)}
                    className="flex items-center text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    <HelpCircle className="h-4 w-4 mr-1" />
                    {showHelp
                      ? t("common.hide") + " " + t("inheritance.blocked")
                      : t("common.show") + " " + t("inheritance.blocked")}
                  </button>

                  {showHelp && (
                    <div className="mt-2 bg-red-50 p-4 rounded-md border border-red-200">
                      <h5 className="font-medium text-red-800 mb-2">
                        {t("inheritance.blockedHeirs")}
                      </h5>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-red-700">
                        {results
                          .filter((result) => result.isBlocked)
                          .map((result, index) => (
                            <li key={index}>
                              {result.relationship}: {result.explanation}
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 text-xs text-slate-500 italic">
                {t("inheritance.note")}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings modal */}
      {showSettingsModal && (
        <SettingsModal onClose={() => setShowSettingsModal(false)} />
      )}
    </div>
  );
};

export default InheritanceCalculator;
