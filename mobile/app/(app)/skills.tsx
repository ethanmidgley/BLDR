import { styles } from "@/constants/style";
import { Entypo } from "@expo/vector-icons";
import { Dispatch, useState } from "react";
import React from "react";
import { Image } from "expo-image";
import { View, Text, FlatList, Pressable } from "react-native";

const skillImages = {
  basic_footwork: require("../../assets/images/skills/basic-footwork.jpg"),
  three_points_of_contact: require("../../assets/images/skills/three-points-of-contact.jpg"),
  silent_feet: require("../../assets/images/skills/silent-feet.jpg"),
  falling_technique: require("../../assets/images/skills/falling-technique.jpg"),
  reading_routes: require("../../assets/images/skills/reading-routes.jpg"),
  body_positioning: require("../../assets/images/skills/body-positioning.jpg"),
  smearing: require("../../assets/images/skills/smearing.jpg"),
  flagging: require("../../assets/images/skills/flagging.jpg"),
  heel_toe_hookes: require("../../assets/images/skills/heel-toe-hook.jpg"),
  mantling: require("../../assets/images/skills/mantling.jpg"),
  deadpointing: require("../../assets/images/skills/deadpointing.jpg"),
  grip_strength_training: require("../../assets/images/skills/grip-strength-training.jpg"),
  core_strength: require("../../assets/images/skills/core-strength.jpg"),
  flexibility_mobility: require("../../assets/images/skills/flexibility-mobility.jpg"),
  endurance_drills: require("../../assets/images/skills/endurance-drills.jpg"),
};

type skillImageKey = keyof typeof skillImages;

const climbingSkills: Category[] = [
  {
    category: "Beginner Skills",
    skills: [
      {
        name: "Basic Footwork",
        image: "basic_footwork",
        why_it_matters:
          "Footwork is one of the most important aspects of climbing. Many beginners rely too much on their arms, which quickly leads to fatigue. Proper foot placement helps conserve energy and maintain balance, allowing for smoother and more controlled climbing.",
        key_points: [
          "Use the inside edge of your shoe for precision on small footholds.",
          "Use the outside edge when stepping across your body.",
          "Place your foot gently, not slamming it onto the hold, to maintain control.",
        ],
      },
      {
        name: "Three Points of Contact",
        image: "three_points_of_contact",
        why_it_matters:
          "Maintaining three points of contact at all times improves balance and stability. This prevents unnecessary swings and reduces the chance of slipping off the wall.",
        key_points: [
          "Always maintain two feet and one hand or two hands and one foot on the wall.",
          "Avoid lunging or jumping unnecessarily—slow, controlled movement is best.",
        ],
      },
      {
        name: "Silent Feet",
        image: "silent_feet",
        why_it_matters:
          "Precise footwork helps you stay in control and prevents unnecessary energy waste. Loud foot placements often mean sloppy movements, which can lead to falling off unexpectedly.",
        key_points: [
          "Place your foot on a hold without making a sound—this ensures careful and controlled movement.",
          "Look at your foot before placing it—don’t rush!",
        ],
      },
      {
        name: "Falling Technique",
        image: "falling_technique",
        why_it_matters:
          "Falling is an unavoidable part of bouldering. Learning how to fall safely reduces the risk of injury, helping climbers stay confident and avoid hesitation on difficult moves.",
        key_points: [
          "Relax as you fall—tensing up can cause injuries.",
          "Land with bent knees, absorbing impact by rolling backward if necessary.",
          "Don’t try to grab holds to stop your fall—it can cause finger injuries.",
        ],
      },
      {
        name: "Reading Routes",
        image: "reading_routes",
        why_it_matters:
          "Planning ahead makes climbs easier and more efficient. Many beginners get stuck halfway up because they didn’t think about where to go next. Learning to analyze the route before climbing helps avoid unnecessary strain and awkward moves.",
        key_points: [
          "Before climbing, look at the route and identify hand and foot holds.",
          "Try to visualize where you’ll move before you get on the wall.",
          "Watch other climbers for technique tips on the same route.",
        ],
      },
    ],
  },
  {
    category: "Intermediate Skills",
    skills: [
      {
        name: "Body Positioning",
        image: "body_positioning",
        why_it_matters:
          "Good body positioning prevents unnecessary strain on your arms and fingers. Keeping your hips close to the wall allows you to maintain balance with less effort, making difficult moves feel much easier.",
        key_points: [
          "Keep your hips close to the wall—this reduces strain on your arms.",
          "Keep your arms straight when resting—bent arms tire faster.",
          "Pivot your hips sideways to reach farther without overextending.",
        ],
      },
      {
        name: "Smearing",
        image: "smearing",
        why_it_matters:
          "When there are no footholds, smearing allows you to use friction against the wall to stay balanced. This is essential for slab climbing and transitioning between holds.",
        key_points: [
          "Press the sole of your shoe against the wall and push down.",
          "Engage your legs and core to keep your balance.",
        ],
      },
      {
        name: "Flagging",
        image: "flagging",
        why_it_matters:
          "Flagging prevents your body from swinging wildly when reaching for holds, especially on overhanging routes. This makes moves feel smoother and more controlled.",
        key_points: [
          "Extend a leg outward to counterbalance your weight.",
          "Helps on overhanging routes where a foot isn’t available.",
        ],
      },
    ],
  },
  {
    category: "Advanced Skills",
    skills: [
      {
        name: "Heel & Toe Hooks",
        image: "heel_toe_hookes",
        why_it_matters:
          "These techniques reduce strain on your arms by allowing your legs to do more work.",
        key_points: [
          "Heel hook – Place your heel on a hold and pull your body up.",
          "Toe hook – Hook your toes around a hold to keep your body close.",
        ],
      },
      {
        name: "Mantling",
        image: "mantling",
        why_it_matters:
          "Needed to get over ledges or top out boulders. Many climbers struggle with topping out because they don’t use a mantling motion.",
        key_points: ["Press down on a hold like doing a push-up."],
      },
      {
        name: "Deadpointing",
        image: "deadpointing",
        why_it_matters:
          "A controlled jump reduces wasted energy and improves efficiency.",
        key_points: ["Swing slightly to generate momentum."],
      },
    ],
  },
  {
    category: "Strength & Conditioning",
    skills: [
      {
        name: "Grip Strength Training",
        image: "grip_strength_training",
        why_it_matters:
          "Strong fingers allow for better endurance on small holds.",
      },
      {
        name: "Core Strength",
        image: "core_strength",
        why_it_matters:
          "A strong core improves balance and movement efficiency.",
      },
      {
        name: "Flexibility & Mobility",
        image: "flexibility_mobility",
        why_it_matters:
          "More flexibility allows you to reach holds more easily.",
      },
      {
        name: "Endurance Drills",
        image: "endurance_drills",
        why_it_matters: "Helps climbers complete longer climbs without tiring.",
      },
    ],
  },
];

type Skill = {
  name: string;
  image: skillImageKey;
  why_it_matters: string;
  key_points?: string[];
};

type SkillProps = Skill & {
  setSkill: Dispatch<React.SetStateAction<Skill | null>>;
};

type Category = {
  category: string;
  skills: Skill[];
};

type CategoryProps = Category & {
  setSkill: Dispatch<React.SetStateAction<Skill | null>>;
  inverted: boolean;
};

const SkillView = ({ setSkill, ...skill }: SkillProps) => {
  return (
    <Pressable
      style={{
        width: 280,
        height: 280,
        marginRight: 10,
      }}
      onPress={() => setSkill(skill)}
    >
      <Image
        source={skill.image ? skillImages[skill.image] : skillImages.flagging}
        contentFit="cover"
        style={{ width: "auto", height: 280, borderRadius: 5 }}
      />
      <View
        style={{
          backgroundColor: "rgba(255,255,255,0.75)",
          width: "100%",
          height: 40,
          bottom: 0,
          position: "absolute",
          justifyContent: "center",
          flexDirection: "column",
          borderBottomLeftRadius: 5,
          borderBottomRightRadius: 5,
        }}
      >
        <Text
          style={{
            fontSize: 17,
            textAlign: "center",
            fontFamily: "Archivo_400Regular",
          }}
        >
          {skill.name}
        </Text>
      </View>
    </Pressable>
  );
};

const CategoryView = ({
  inverted,
  category,
  skills,
  setSkill,
}: CategoryProps) => {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text
        style={{
          fontFamily: "Archivo_500Medium",
          fontSize: 30,
          marginVertical: 10,
        }}
      >
        {category}
      </Text>
      <FlatList
        inverted={inverted}
        horizontal={true}
        data={skills}
        renderItem={(d) => <SkillView {...d.item} setSkill={setSkill} />}
      />
    </View>
  );
};

export default function Skills() {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  return (
    <View>
      <View style={{ padding: 10 }}>
        <Text
          style={{
            fontSize: 40,
            fontFamily: "Archivo_700Bold_Italic",
          }}
        >
          Skills
        </Text>
        <FlatList
          data={climbingSkills}
          renderItem={(c) => (
            <CategoryView
              {...c.item}
              setSkill={setSelectedSkill}
              inverted={c.index % 2 === 1}
            />
          )}
          ListFooterComponent={<View style={{ width: 1, height: 150 }}></View>}
        />
      </View>
      {selectedSkill ? (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "100%",
            backgroundColor: "white",
            padding: 16,
            elevation: 5, // Adds a shadow effect
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              flexDirection: "row",
              padding: 10,
              justifyContent: "space-between",
              alignContent: "center",
            }}
          >
            <Text style={{ fontSize: 20 }}>{selectedSkill.name}</Text>
            <Entypo
              name="cross"
              size={24}
              color="black"
              onPress={() => setSelectedSkill(null)}
            />
          </View>

          <Text>Why it matters:</Text>
          <Text>{selectedSkill.why_it_matters}</Text>
          {selectedSkill.key_points ? (
            <View>
              <Text>Key points: </Text>
              {selectedSkill.key_points.map((point, idx) => (
                <Text key={idx}>
                  {idx + 1}. {point}
                </Text>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
