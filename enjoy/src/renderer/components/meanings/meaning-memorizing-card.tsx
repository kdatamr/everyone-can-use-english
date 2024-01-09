import { t } from "i18next";
import { useState, useEffect, useRef } from "react";
import { Button, ScrollArea, Separator } from "@renderer/components/ui";
import Mark from "mark.js";

export const MeaningMemorizingCard = (props: { meaning: MeaningType }) => {
  const {
    meaning: { word, lookups },
  } = props;
  const [side, setSide] = useState<"front" | "back">("front");

  useEffect(() => {
    setSide("front");
  }, [word]);

  if (side === "front")
    return (
      <FrontSide word={word} lookups={lookups} onFlip={() => setSide("back")} />
    );
  if (side === "back")
    return <BackSide meaning={props.meaning} onFlip={() => setSide("front")} />;
};

const FrontSide = (props: {
  word: string;
  lookups: LookupType[];
  onFlip: () => void;
}) => {
  const { word, lookups, onFlip } = props;
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    if (!ref.current) return;

    const mark = new Mark(ref.current);
    mark.mark([word], {
      separateWordSearch: false,
      caseSensitive: false,
      acrossElements: true,
    });

    return () => {
      mark.unmark();
    };
  }, [word, ref]);

  return (
    <div className="flex flex-col h-full">
      <h2 className="py-8 text-4xl font-bold font-serif text-center">{word}</h2>
      <div className="px-6">
        <div className="mb-4 italic text-sm">{t("context")}</div>
      </div>
      <ScrollArea className="flex-1 px-6 text-lg font-serif">
        <div ref={ref} className="">
          {lookups.map((lookup) => (
            <p key={lookup.id} className="mb-8">
              {lookup.context}
            </p>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-4 flex items-center justify-center">
        <Button variant="default" onClick={onFlip}>
          {t("backSide")}
        </Button>
      </div>
    </div>
  );
};

const BackSide = (props: { meaning: MeaningType; onFlip: () => void }) => {
  const {
    meaning: {
      id,
      word,
      lemma,
      pronunciation,
      pos,
      definition,
      translation,
      lookups,
    },
    onFlip,
  } = props;

  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    if (!ref.current) return;

    const mark = new Mark(ref.current);
    mark.mark([word], {
      separateWordSearch: false,
      caseSensitive: false,
      acrossElements: true,
    });

    return () => {
      mark.unmark();
    };
  }, [id, ref]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <h2 className="py-8 text-4xl font-bold font-serif text-center">{word}</h2>
      <div className="px-6">
        <div className="mb-2">
          {pos && (
            <span className="italic text-sm text-muted-foreground mr-2">
              {pos}
            </span>
          )}
          {pronunciation && (
            <span className="text-sm mr-2">/{pronunciation}/</span>
          )}
          {lemma && lemma !== word && (
            <span className="text-sm">({lemma})</span>
          )}
        </div>
        {translation && <div className="mb-2">{translation}</div>}
        <div className="mb-2">
          <span>{definition}</span>
        </div>

        <Separator className="my-6" />
        <div className="mb-4 italic text-sm">{t("context")}</div>
      </div>

      <ScrollArea className="flex-1 px-6 text-lg font-serif">
        <div ref={ref} className="">
          {lookups.map((lookup) => (
            <div key={lookup.id} className="mb-8">
              <div className="mb-2">{lookup.context}</div>
              <div className="text-base">{lookup.contextTranslation}</div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="mt-4 flex items-center justify-center">
        <Button variant="secondary" onClick={onFlip}>
          {t("frontSide")}
        </Button>
      </div>
    </div>
  );
};
