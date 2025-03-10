import { styles } from "@/constants/style";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { Dispatch, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const climbingSkills = [
  {
    category: "Beginner Skills (Getting Started)",
    description:
      "These foundational skills will help you climb safely, efficiently, and with confidence.",
    skills: [
      {
        name: "Basic Footwork",
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
        why_it_matters:
          "Maintaining three points of contact at all times improves balance and stability. This prevents unnecessary swings and reduces the chance of slipping off the wall.",
        key_points: [
          "Always maintain two feet and one hand or two hands and one foot on the wall.",
          "Avoid lunging or jumping unnecessarily—slow, controlled movement is best.",
        ],
      },
      {
        name: "Silent Feet",
        why_it_matters:
          "Precise footwork helps you stay in control and prevents unnecessary energy waste. Loud foot placements often mean sloppy movements, which can lead to falling off unexpectedly.",
        key_points: [
          "Place your foot on a hold without making a sound—this ensures careful and controlled movement.",
          "Look at your foot before placing it—don’t rush!",
        ],
      },
      {
        name: "Proper Falling Technique",
        why_it_matters:
          "Falling is an unavoidable part of bouldering. Learning how to fall safely reduces the risk of injury, helping climbers stay confident and avoid hesitation on difficult moves.",
        key_points: [
          "Relax as you fall—tensing up can cause injuries.",
          "Land with bent knees, absorbing impact by rolling backward if necessary.",
          "Don’t try to grab holds to stop your fall—it can cause finger injuries.",
        ],
      },
      {
        name: "Reading Routes (Route-Finding)",
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
    category: "Intermediate Skills (Building Confidence)",
    skills: [
      {
        name: "Body Positioning",
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
        why_it_matters:
          "When there are no footholds, smearing allows you to use friction against the wall to stay balanced. This is essential for slab climbing and transitioning between holds.",
        key_points: [
          "Press the sole of your shoe against the wall and push down.",
          "Engage your legs and core to keep your balance.",
        ],
      },
      {
        name: "Flagging",
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
    category: "Advanced Skills (Mastering Techniques)",
    skills: [
      {
        name: "Heel & Toe Hooks",
        why_it_matters:
          "These techniques reduce strain on your arms by allowing your legs to do more work.",
        key_points: [
          "Heel hook – Place your heel on a hold and pull your body up.",
          "Toe hook – Hook your toes around a hold to keep your body close.",
        ],
      },
      {
        name: "Mantling",
        why_it_matters:
          "Needed to get over ledges or top out boulders. Many climbers struggle with topping out because they don’t use a mantling motion.",
        key_points: ["Press down on a hold like doing a push-up."],
      },
      {
        name: "Deadpointing",
        why_it_matters:
          "A controlled jump reduces wasted energy and improves efficiency.",
        key_points: ["Swing slightly to generate momentum."],
      },
    ],
  },
  {
    category: "Strength & Conditioning (Supplementary Training)",
    skills: [
      {
        name: "Grip Strength Training",
        why_it_matters:
          "Strong fingers allow for better endurance on small holds.",
      },
      {
        name: "Core Strength",
        why_it_matters:
          "A strong core improves balance and movement efficiency.",
      },
      {
        name: "Flexibility & Mobility",
        why_it_matters:
          "More flexibility allows you to reach holds more easily.",
      },
      {
        name: "Endurance Drills",
        why_it_matters: "Helps climbers complete longer climbs without tiring.",
      },
    ],
  },
];

type Skill = {
  name: string;
  why_it_matters: string;
  key_points?: string[];
};

type SkillProps = Skill & {
  setSkill: Dispatch<React.SetStateAction<Skill | null>>;
};

type CategoryProps = {
  category: string;
  skills: Skill[];
  setSkill: Dispatch<React.SetStateAction<Skill | null>>;
};

const SkillView = ({ setSkill, ...skill }: SkillProps) => {
  return (
    <Pressable
      style={{
        width: 200,
        height: 200,
        marginRight: 10,
        backgroundColor: "blue",
      }}
      onPress={() => setSkill(skill)}
    >
      <Text>{skill.name}</Text>
    </Pressable>
  );
};

const CategoryView = ({ category, skills, setSkill }: CategoryProps) => {
  return (
    <View>
      <Text style={styles.text}>{category}</Text>
      <FlatList
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
      <Text style={{ fontSize: 40, fontWeight: 700 }}>Skills</Text>
      <FlatList
        data={climbingSkills}
        renderItem={(c) => (
          <CategoryView {...c.item} setSkill={setSelectedSkill} />
        )}
        ListFooterComponent={<View style={{ width: 1, height: 150 }}></View>}
      />
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
