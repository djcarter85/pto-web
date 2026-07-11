type TeamImageProps = {
  team: {
    name: string;
    id: number;
  };
};

export const TeamImage = ({ team }: TeamImageProps) => {
  return (
    // TODO define different sizes for different contexts
    <div className="flex size-7 items-center justify-center overflow-hidden">
      <img
        src={`/team-images/logo-${team.id}.svg`}
        alt={`${team.name} logo`}
        className="size-7 object-contain"
      />
    </div>
  );
};
