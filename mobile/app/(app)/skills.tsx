import { Entypo } from "@expo/vector-icons";
import { Dispatch, useCallback, useRef, useState } from "react";
import React from "react";
import { Image } from "expo-image";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Wrapper from "@/components/Wrapper";
import { styles } from "@/constants/style";
import YoutubePlayer from "react-native-youtube-iframe";

const skillImages = {
  basic_footwork: require("../../assets/images/skills/basic-footwork.jpg"),
  three_points_of_contact: require("../../assets/images/skills/three-points-of-contact.jpg"),
  silent_feet: require("../../assets/images/skills/silent-feet.jpg"),
  falling_technique: require("../../assets/images/skills/falling-technique.jpg"),
  reading_routes: require("../../assets/images/skills/reading-routes.jpg"),
  body_positioning: require("../../assets/images/skills/body-positioning.jpg"),
  smearing: require("../../assets/images/skills/smearing.jpg"),
  flagging: require("../../assets/images/skills/flagging.jpg"),
  heel_toe_hooks: require("../../assets/images/skills/heel-toe-hook.jpg"),
  mantling: require("../../assets/images/skills/mantling.jpg"),
  deadpointing: require("../../assets/images/skills/deadpointing.jpg"),
  grip_strength_training: require("../../assets/images/skills/grip-strength-training.jpg"),
  core_strength: require("../../assets/images/skills/core-strength.jpg"),
  flexibility_mobility: require("../../assets/images/skills/flexibility-mobility.jpg"),
  endurance_drills: require("../../assets/images/skills/endurance-drills.jpg"),
};

const skill_videos = {
  basic_footwork: "KoTG-0_smTE",
  three_points_of_contact: "jumbbU0KqQw",
  silent_feet: "UqGvom5-yNo",
  falling_technique: "Qc7ZQHE9L9w",
  reading_routes: "XnScNp24xEU",
  body_positioning: "hAo_ismiUEU",
  smearing: "Psu2y-weRnM",
  flagging: "juPtjVgcQbg",
  heel_toe_hooks: "wdamT5lhWyI",
  mantling: "dSbNqltm6Nk",
  deadpointing: "cre_htAhJh4",
  grip_strength_training: "XXrDQ8PCAmI",
  core_strength: "E621anInG5s",
  flexibility_mobility: "kE9r9kteF4M",
  endurance_drills: "Y6BxtLXfAFI",
};

type skillImageKey = keyof typeof skillImages;

type skill_video_key = keyof typeof skill_videos;

const climbingSkills: Category[] = [
  {
    category: "Beginner Skills",
    skills: [
      {
        name: "Basic Footwork",
        image: "basic_footwork",
        why_it_matters:
          "Good footwork is the foundation of efficient climbing. Many beginners rely too much on their arms, leading to quick fatigue. Precise foot placement allows climbers to distribute weight effectively, reducing unnecessary strain and improving control on the wall. By mastering footwork, climbers can move smoothly and confidently, making more advanced techniques easier to learn later.",
        key_points: [
          "Always look at your footholds before placing your foot. Avoid blindly stepping.",
          "Use the edges of your climbing shoes for better precision and grip.",
          "Keep weight on your feet rather than overloading your arms.",
          "Minimize unnecessary foot adjustments to maintain stability.",
        ],
        next_steps: [
          "Practice moving up the wall using only your feet and minimal hand support.",
          "Focus on keeping your heels low and placing your toes precisely.",
          "Try climbing slow and controlled, ensuring every foot placement is deliberate.",
        ],
      },
      {
        name: "Three Points of Contact",
        image: "three_points_of_contact",
        why_it_matters:
          "Maintaining three points of contact ensures stability and control. This technique helps beginners build confidence, balance, and body awareness while reducing the risk of falls. It lays the groundwork for more advanced dynamic movements where precision and stability are key",
        key_points: [
          "Always maintain two feet and one hand or two hands and one foot on the wall.",
          "Shift weight gradually and avoid sudden, jerky movements",
          "Engage core muscles to maintain stability when moving a limb.",
          "Use this technique as a foundation before attempting dynamic movements.",
        ],
        next_steps: [
          "Try pausing after every movement to ensure three points of contact are maintained.",
          "Experiment with different hand and foot placements to develop control.",
          "Gradually introduce small dynamic movements while keeping three points of contact as much as possible.",
        ],
      },
      {
        name: "Silent Feet",
        image: "silent_feet",
        why_it_matters:
          "Silent footwork encourages precision, control, and efficiency. By focusing on quiet and deliberate movements, climbers learn to place their feet more accurately, reducing wasted energy and improving balance. Mastering this skill leads to smoother, more effortless climbing.",
        key_points: [
          "Place feet deliberately rather than slamming them onto holds.",
          "Look at your foot as well as the foothold before placing it, don’t rush!",
          "Control foot movements to avoid slipping or unnecessary adjustments",
        ],
        next_steps: [
          "Record your climbs and observe how often you adjust your feet—work on minimizing this",
          "Challenge yourself by keeping a slow and steady rhythm while climbing.",
        ],
      },
      {
        name: "Falling Technique",
        image: "falling_technique",
        why_it_matters:
          "Knowing how to fall properly reduces the risk of injury and builds confidence when attempting difficult moves. Many climbers hesitate to try new techniques due to fear of falling, but understanding and practicing safe falls can remove this mental barrier.",
        key_points: [
          "Relax as you fall tensing up can cause injuries.",
          "Land with bent knees, absorbing impact by rolling backward if necessary.",
          "Keep arms slightly bent and relaxed to prevent wrist and elbow strain.",
          "Don’t try to grab holds to stop your fall—it can cause finger injuries.",
          "If possible, push away from the wall slightly to land on your feet rather than hitting obstacles.",
        ],
        next_steps: [
          "Practice falling from low heights onto padded surfaces to get comfortable with the movement.",
          "Work on landing softly and rolling when needed to reduce impact.",
          "Try climbing more confidently by trusting your ability to fall safely.",
        ],
      },
      {
        name: "Reading Routes",
        image: "reading_routes",
        why_it_matters:
          "Route reading helps climbers anticipate movements and sequences before starting, improving efficiency and reducing unnecessary pauses. This skill is essential for more difficult climbs, where a lack of planning can lead to wasted energy and failed attempts.",
        key_points: [
          "Before climbing, look at the route and identify hand and foot holds.",
          "Identify resting spots where you can shake out your hands.",
          "Spot crux moves (the most difficult sections) and strategize accordingly.",
          "Watch other climbers for technique tips on the same route.",
          "Be adaptable—if your initial plan doesn’t work, adjust on the fly.",
        ],
        next_steps: [
          "Try climbing the route without stopping to analyze how well your plan worked.",
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
          "Good body positioning allows climbers to move efficiently while minimizing strain on their arms. Proper positioning makes reaching holds easier and improves balance, making climbing feel more natural and fluid.",
        key_points: [
          "Keep your hips close to the wall to reduces strain on your arms and improve balance and control.",
          "Use legs to push rather than relying on arms to pull yourself up",
          "Pivot your hips sideways to reach farther without overextending.",
          "Maintain an open body posture to maximize reach",
          "Shift your center of gravity efficiently to reduce wasted energy.",
        ],
        next_steps: [
          "Try routes with different angles and observe how body positioning affects movement.",
          "Focus on making small adjustments to your body to optimize efficiency.",
        ],
      },
      {
        name: "Smearing",
        image: "smearing",
        why_it_matters:
          "Smearing is essential when no footholds are available. By using friction against the wall, climbers can generate enough grip to push themselves upward, making it vital for slab climbing and technical routes.",
        key_points: [
          "Press the sole of your shoe against the wall and push down.",
          "Engage your legs and core to keep your balance.",
          "Keep your weight centered over your foot to maintain grip.",
          "Confidence in smearing improves performance.",
        ],
        next_steps: [
          "Practice smearing on easy slab routes to build confidence.",
          "Test different levels of pressure to understand how friction works.",
          "Work on keeping your weight centered to avoid slippin",
        ],
      },
      {
        name: "Flagging",
        image: "flagging",
        why_it_matters:
          "Flagging prevents unnecessary swinging and improves balance when making dynamic or off-balance moves. By extending a leg in the opposite direction, climbers counteract shifts in their center of gravity.",
        key_points: [
          "Extend a leg outward to counterbalance your weight.",
          "Helps on overhanging routes where a foot isn’t available.",
          "Engage your core to maintain stability.",
          "Use flagging instead of foot swaps to avoid inefficient movements",
          "Practice on different angles to improve technique.",
        ],
        next_steps: [
          "Try climbing routes while intentionally flagging to maintain balance.",
          "Observe how experienced climbers use flagging to stabilize their movements.",
          "Practice flagging on different holds to build versatility.",
        ],
      },
    ],
  },
  {
    category: "Advanced Skills",
    skills: [
      {
        name: "Heel & Toe Hooks",
        image: "heel_toe_hooks",
        why_it_matters:
          "Heel and toe hooks help secure your body position, particularly on overhangs and technical routes. These techniques allow you to shift weight away from your arms, making moves more efficient and reducing fatigue. Mastering hooks improves control, helps with resting positions, and unlocks advanced movement options.",
        key_points: [
          "Heel Hook: Place your heel on a hold and pull with your hamstring to secure your position.",
          "Toe Hook: Use the top of your shoe to press against a hold, keeping tension through your core.",
          "Engage your core and legs to take pressure off your arms",
          "Look for opportunities to use hooks instead of relying on pure grip strength.",
        ],
        next_steps: [
          "Practice heel hooks on overhangs and slab routes to understand weight distribution.",
          "Try toe hooking on volumes or large holds to stabilize your body.",
          "Watch experienced climbers use these techniques and mimic their movements.",
        ],
      },
      {
        name: "Mantling",
        image: "mantling",
        why_it_matters:
          "Mantling is essential for topping out on boulders and ledges. It involves pressing down with your hands and shifting your weight over your feet instead of pulling with your arms. This technique helps conserve energy and gives you the leverage to complete climbs that end with a ledge.",
        key_points: [
          "Push with your palms instead of pulling with your arms.",
          "Engage your legs to assist in shifting weight upward.",
          "Keep your chest over the ledge to maintain balance.",
          "Transition smoothly from pressing to stepping up.",
        ],
        next_steps: [
          "Find a route with a ledge and practice mantling instead of pulling",
          "Use dynamic motion from your legs to assist the press.",
          "Build strength in triceps and shoulders to make mantling easier.",
        ],
      },
      {
        name: "Deadpointing",
        image: "deadpointing",
        why_it_matters:
          "Deadpointing is a controlled dynamic movement that reduces strain on your arms and helps reach distant holds with precision. It’s crucial for making static movements more efficient while maintaining control",
        key_points: [
          "Generate momentum from your legs before committing to the move.",
          "Aim to grab the hold at the peak of your movement.",
          "Use core engagement to stabilize your body mid-movement.",
        ],
        next_steps: [
          "Practice deadpointing on slightly out-of-reach holds to refine your accuracy.",
          "Work on timing and momentum to minimize unnecessary swings.",
          "Incorporate deadpointing into routes that require precise dynamic movement.",
        ],
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
          "Grip endurance and finger strength are critical for sustaining climbs. Weak grip leads to early fatigue, limiting progress on challenging routes. Strengthening your grip helps with endurance and increases your ability to hold onto smaller or more difficult holds.",
        key_points: [
          "Train using hangboards, fingerboards, and campus boards for targeted finger strength.",
          "Incorporate pinch grip, open-hand grip, and crimping exercises to develop versatile strength.",
          "Rest and recover properly to prevent finger injurie.",
        ],
        next_steps: [
          "Start with repeaters on a hangboard (7 seconds on, 3 seconds off) to build endurance.",
          "Gradually increase resistance and duration for sustained grip strength.",
          "Avoid overtraining—integrate rest days to prevent tendon strain.",
        ],
      },
      {
        name: "Core Strength",
        image: "core_strength",
        why_it_matters:
          "A strong core helps with body tension, balance, and stability, especially on overhangs and technical climbs. It allows you to control swings and maintain proper positioning on the wall.",
        key_points: [
          "Engage your core to reduce swinging and maintain control.",
          "Strengthen obliques, lower abs, and hip flexors for better stability.",
          "Use static holds and dynamic exercises to build endurance.",
        ],
        next_steps: [
          "Perform hanging leg raises and front levers to train climbing-specific core strength.",
          "Practice planks and hollow body holds for endurance.",
          "Focus on maintaining core engagement while climbing, especially on overhangs.",
        ],
      },
      {
        name: "Flexibility & Mobility",
        image: "flexibility_mobility",
        why_it_matters:
          "Good flexibility increases your range of motion, allowing you to make high steps, reach far holds, and move efficiently. Mobility prevents injuries and helps execute complex techniques with ease.",
        key_points: [
          "Stretch hip flexors, hamstrings, and shoulders regularly",
          "Incorporate dynamic stretching before climbing and static stretching afterward.",
          "Improve hip mobility for better high stepping and drop knee movements.",
        ],
        next_steps: [
          "Add yoga and mobility drills to your routine for flexibility gains.",
          "Work on high stepping and drop knees to apply mobility to climbing.",
          "Stretch consistently to prevent stiffness and improve movement.",
        ],
      },
      {
        name: "Endurance Drills",
        image: "endurance_drills",
        why_it_matters:
          "Climbing endurance allows you to sustain longer climbs, reducing pump (forearm fatigue) and improving overall performance. Good endurance helps with multi-move sequences and prolonged effort on overhanging routes.",
        key_points: [
          "Train ARC (Aerobic Restoration & Capillarity) by climbing easy routes for extended periods.",
          "Incorporate interval training (climb for 1-2 minutes, rest, repeat) to simulate real climbing demands.",
          "Focus on efficient movement and controlled breathing to delay fatigue.",
        ],
        next_steps: [
          'Try "4x4s" (climbing 4 boulder problems back-to-back for 4 rounds).',
          "Climb easy routes for 10-15 minutes without stopping to build endurance.",
          "Work on active recovery techniques like shaking out between moves.",
        ],
      },
    ],
  },
];

type Skill = {
  name: string;
  image: skillImageKey;
  why_it_matters: string;
  key_points?: string[];
  next_steps?: string[];
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
  //inverted: boolean;
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
        <Text style={[styles.headingSmall, { textAlign: "center" }]}>
          {skill.name}
        </Text>
      </View>
    </Pressable>
  );
};

const CategoryView = ({
  //inverted,
  category,
  skills,
  setSkill,
}: CategoryProps) => {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text
        style={[
          styles.headingMedium,
          {
            marginVertical: 10,
          },
        ]}
      >
        {category}
      </Text>
      <FlatList
        //inverted={inverted}
        horizontal={true}
        data={skills}
        renderItem={(d) => <SkillView {...d.item} setSkill={setSkill} />}
      />
    </View>
  );
};

export default function Skills() {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state: String) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  return (
    <View>
      <Wrapper>
        <FlatList
          data={climbingSkills}
          renderItem={(c) => (
            <CategoryView
              {...c.item}
              setSkill={setSelectedSkill}
              //inverted={c.index % 2 === 1}
            />
          )}
        />
      </Wrapper>
      {selectedSkill ? (
        <ScrollView
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "100%",
            backgroundColor: "white",
            padding: 16,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "center",
            }}
          >
            <Text style={{ fontFamily: "Archivo_500Medium", fontSize: 30 }}>
              {selectedSkill.name}
            </Text>
            <Entypo
              name="cross"
              size={30}
              color="black"
              onPress={() => setSelectedSkill(null)}
            />
          </View>

          <Text
            style={{
              fontSize: 17,
              fontFamily: "Archivo_400Regular",
              marginTop: 16,
            }}
          >
            Why it matters:
          </Text>
          <Text>{selectedSkill.why_it_matters}</Text>
          {selectedSkill.key_points ? (
            <View>
              <View style={{marginBottom: 10}}>
              <Text
                style={{
                  fontSize: 17,
                  marginTop: 16,
                  fontFamily: "Archivo_400Regular",
                }}
              >
                Key points:
              </Text>
              {selectedSkill.key_points.map((point, idx) => (
                <Text key={idx} style={{ marginBottom: 10 }}>
                  {idx + 1}. {point}
                </Text>
              ))}
            </View>

                <YoutubePlayer
                  height={200}
                  play={playing}
                  videoId={selectedSkill.image ? skill_videos[selectedSkill.image] : skill_videos.flagging}
                  onChangeState={onStateChange}
                />
            </View>
          ) : null}
          {selectedSkill.next_steps ? (
            <View style={{ marginBottom: 10 }}>
              <Text
                style={{
                  fontSize: 17,
                  marginTop: 16,
                  fontFamily: "Archivo_400Regular",
                }}
              >
                Next steps:
              </Text>

              {selectedSkill.next_steps.map((point, idx) => (
                <Text key={idx} style={{ marginBottom: 10 }}>
                  {idx + 1}. {point}
                </Text>
              ))}
            </View>
          ) : null}
        </ScrollView>
      ) : null}
    </View>
  );
}
